const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const { Op } = require("sequelize");
const { User, Post, Comment, Image, Health } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

// 로그인 정보 계속 보내주기
router.get("/", async (req, res, next) => {
  // Get /user
  console.log(req.headers); //쿠키
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"],
        },
        order: [[Health, "referencedate", "DESC"]], // Health를 생성순서로 내림차순
        include: [
          { model: Post, attributes: ["id"] },
          { model: User, as: "Followings", attributes: ["id"] }, //모델에서 as 썻다면 include 에서도 같이 명시해줘야한다
          { model: User, as: "Followers", attributes: ["id"] },
          { model: Health },
        ], // hasMany이기 때문에 model: Post가 복수형이 되어 me.Posts가 된다.
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:userId/posts", async (req, res, next) => {
  // GET /user/1/posts
  try {
    const where = { UserId: req.params.userId };
    if (parseInt(req.query.lastId, 10)) {
      //초기 로딩이 아닐때 (0이 아닐때)
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; //id가 lastId보다 작은
    } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
    const posts = await Post.findAll({
      where,
      limit: 10, // 5개 가져오기
      // offset: req.body.postLength, // limit이 10일때 offset이 0이면 1~10 1이면 10이면 11~20 100이면 101~110
      // 실무에선 limit offset 방법을 잘 쓰지 않는다 why? 로딩 중간에 게시물이 삭제되거나 추가되면 offset과 limit이 꼬여버린다. ex) 11번 게시물 두번 불러오는등
      // 그럼 뭘 쓰나? lastPostID 방법같은거 자주 사용한다. DB에서 제공하는것이 아닌 임의로 구현
      // where: {UserId : 1}, //UserId가 1번인 게시글들
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"], // Comment를 생성순서로 내림차순( 늦게 생성된 순서 (즉 최신순))
      ], // 2차원 배열인 이유는 여러 기준으로 정렬할 수 있기 때문
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [{ model: User, attributes: ["id", "nickname"] }],
        },
        { model: User, as: "Likers", attributes: ["id"] }, //좋아요 누른 사람
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
      ],
    });

    // console.log(req.body.postLength, req.body.data, posts);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  console.log("routes/user.js | passport.authenticate()함수 실행");
  passport.authenticate("local", (err, user, info) => {
    // local에서 넘어온 done()의 결과가 여기로 여기 콜백함수로 넘어온다.
    console.log("routes/user.js | passport.authenticate()콜백 함수 실행");
    if (err) {
      // 서버에러
      console.error(err, "routes/user.js");
      return next(err);
    }

    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        //passport 로그인 절차에서 error가 난다면(?) 거의 안일어나지만 혹시나...?
        console.error(loginErr, "routes/user.js");
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        // attributes: ["id", "nickname", "email"],
        attributes: {
          exclude: ["password"],
        },
        include: [
          { model: Post, attributes: ["id"] },
          { model: User, as: "Followings", attributes: ["id"] }, //모델에서 as 썻다면 include 에서도 같이 명시해줘야한다
          { model: User, as: "Followers", attributes: ["id"] },
        ], // hasMany이기 때문에 model: Post가 복수형이 되어 me.Posts가 된다.
      });
      return res.status(201).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post("/", isNotLoggedIn, async (req, res, next) => {
  //app.js의 app.use(/user) 와 합쳐져서 //Post /user/

  // 메서드가 비동기냐 아닌지냐는 공식문서를 보고 찾아야한다
  try {
    //User에서 중복확인
    const exUser = await User.findOne({
      //없다면 null이 나온다.
      where: {
        email: req.body.email,
      },
    });

    if (exUser) {
      return res.status(403).send("이미 사용 중인 이메일입니다.");
    }

    const exNickname = await User.findOne({
      where: {
        nickname: req.body.nickname,
      },
    });

    if (exNickname) {
      return res.status(403).send("이미 사용 중인 닉네임입니다.");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 11); //암호화된 비밀번호를 return 해준다. 보통 10~13의 암호난이도를 정해준다.
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    // res.setHeader("Access-Control-Allow-Origin", "*"); // cors 해결을 위해 Access-Control-Allow-Origin 헤더를 모든 주소에 붙이는 코드 각 routes에 따로따로 써주는 대신 app.js에서 미들웨어로 cors 를붙였다.
    res.status(201).send("ok");
  } catch (error) {
    console.error(error);
    next(error); // status 500
  }
});

router.post("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy(); // session에 저장된 쿠키와 userId 삭제
  res.send("ok");
});

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        // update({무엇을},{어느것을})
        nickname: req.body.nickname,
      },
      { where: { id: req.user.id } }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch("/:UserId/follow", isLoggedIn, async (req, res, next) => {
  // PATCH /user/1/follow
  try {
    const user = await User.findOne({
      where: { id: req.params.UserId },
    });

    if (!user) {
      return res.status(403).send("존재하지 않는 유저입니다.");
    }
    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.UserId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:UserId/follow", isLoggedIn, async (req, res, next) => {
  // DELETE /user/1/follow
  try {
    const user = await User.findOne({
      where: { id: req.params.UserId },
    });

    if (!user) {
      return res.status(403).send("존재하지 않는 유저입니다.");
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.UserId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followers", isLoggedIn, async (req, res, next) => {
  // GET /user/followers
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      return res.status(403).send("존재하지 않는 유저입니다.");
    }
    const followers = await user.getFollowers({
      limit: parseInt(req.query.limit),
      attributes: ["nickname", "id"],
    });
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followings", isLoggedIn, async (req, res, next) => {
  // GET /user/followings
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      return res.status(403).send("존재하지 않는 유저입니다.");
    }

    const followings = await user.getFollowings({
      limit: parseInt(req.query.limit),
      attributes: ["nickname", "id"],
    });
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/follower/:UserId", isLoggedIn, async (req, res, next) => {
  //DELETE /user/follower/1
  try {
    // const user = await User.findOne({
    //   where: { id: req.user.id },
    // });
    // if (!user) {
    //   return res.status(403).send("존재하지 않는 유저입니다.");
    // }
    // await user.removeFollowers(parseInt(req.params.UserId));
    // res.status(200).json({ UserId: parseInt(req.params.UserId) });
    const user = await User.findOne({
      where: { id: req.params.UserId },
    });
    if (!user) {
      return res.status(403).send("존재하지 않는 유저입니다.");
    }
    await user.removeFollowings(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.UserId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  // Get /user/1
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.id },
      attributes: {
        exclude: ["password"],
      },
      include: [
        { model: Post, attributes: ["id"] },
        { model: User, as: "Followings", attributes: ["id"] }, //모델에서 as 썻다면 include 에서도 같이 명시해줘야한다
        { model: User, as: "Followers", attributes: ["id"] },
      ], // hasMany이기 때문에 model: Post가 복수형이 되어 me.Posts가 된다.
    });

    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON(); // 시퀄라이즈에서 보내준 데이터는 toJson을 통해 쓸 수 있는 데이터로 바꿔줘야 한다.
      data.Posts = data.Posts.length;
      data.Followers = data.Followers.length;
      data.Followings = data.Followings.length;
      return res.status(200).json(data);
    }

    res.status(404).send("존재하지 않는 사용자입니다.");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/weight", isLoggedIn, async (req, res, next) => {
  // POST /user/weight
  try {
    const health = await Health.create({
      referencedate: req.body.dateString,
      weight: req.body.weight,
      UserId: req.user.id,
    });
    if (!health) {
      res.status(403).send("잘못된 정보입니다.");
    }
    const exHealth = await Health.findAll({
      where: { UserId: req.user.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
      order: [["referencedate", "DESC"]], // 2차원 배열인 이유는 여러 기준으로 정렬할 수 있기 때문
    });

    res.status(201).json(exHealth);
  } catch (error) {
    console.error(error);
    next(error); // status 500
  }
});

router.delete("/weight/:weightId", isLoggedIn, async (req, res, next) => {
  //DELETE /user/weight/1
  try {
    const desHealth = await Health.destroy({
      where: { id: req.params.weightId, UserId: req.user.id },
    });

    if (!desHealth) {
      res.status(403).send("잘못된 데이터입니다.");
    }

    const health = await Health.findAll({
      where: { UserId: req.user.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
      order: [["referencedate", "DESC"]], // 2차원 배열인 이유는 여러 기준으로 정렬할 수 있기 때문
    });

    res.status(200).json(health);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
