const express = require("express");
const multer = require("multer");
const path = require("path"); //path node 제공
const fs = require("fs"); //fileSystem node 제공

const multerS3 = require("multer-s3"); // 멀터를 통해 AWS S3로 올릴때 사용
const AWS = require("aws-sdk"); // S3 접근권한 얻기 위해 사용

const { Post, Comment, Image, User, Hashtag } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

try {
  fs.accessSync("uploads"); //upload 디렉토리가 있는지 검사(없으면 에러)
} catch (error) {
  console.log("uploads 폴더가 없으므로 생성합니다.");
  fs.mkdirSync("uploads"); //uplaod 디렉토리 생성
}

//AWS
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: "ap-northeast-2",
});

//이미지 업로드용 라우터
const upload = multer({
  //어디에 저장할 것인지
  // storage: multer.diskStorage({
  //   destination(req, file, done) {
  //     done(null, "uploads");
  //   },
  //   filename(req, file, done) {
  //     //ex Ori.jpg 라는 파일이 있을때
  //     //파일명 중복 처리 (기본적으로 노드는 파일명이 중복되면 기존파일에 덮어쓴다)
  //     const ext = path.extname(file.originalname); //확장자 추출(.jpg) //path는 노드에서 제공하는 모듈
  //     const bassname = path.basename(file.originalname, ext); //Ori라는 확장자를 제외한 파일명 추출
  //     done(null, bassname + "_" + new Date().getTime() + ext); // Ori202202031552512.jpg
  //   },
  // }),
  storage: multerS3({
    s3: new AWS.S3(), //S3권한을 얻음
    bucket: "react-nodebird-ori", //버킷 이름
    key(req, file, cb) {
      //저장되는 파일 이름
      cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, //20MB 파일 사이즈 제한
});

router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  // POST /post
  try {
    const $hashtags = req.body.content.match(/#[^\s#]+/g);

    const set = new Set($hashtags); //set객체로 전환하여 중복 제거
    const hashtags = [...set]; //전개 연산자로 배열로 반환// forEach()나  Array.from()으로도 가능

    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id, //로그인을 했기때문에 user에 들어있다.
    });

    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((e) => {
          return Hashtag.findOrCreate({
            //없다면 등록 있다면 return
            where: { name: e.slice(1).toLowerCase() },
          });
        })
      );
      await post.addHashtags(
        result.map((e) => {
          //findOrCreate의 결과는 [[리액트, true], [노드, false]] 꼴로 리턴되기 때문에 map함수로 바깥 배열을 처리  // 두번째 인자는 find되었는지 생성되었는지를 알려주는 boolean 값
          return e[0];
        })
      );
    }

    if (Array.isArray(req.body.image)) {
      //이미지가 여러 개라면? image: [1번.jpg, 2번.jpg]
      const images = await Promise.all(
        req.body.image.map((e) => {
          return Image.create({ src: e });
        })
      );
      await post.addImages(images);
    } else if (req.body.image) {
      // 이미지가 한개라면? image: i번.jpg
      const image = await Image.create({
        src: req.body.image,
      });
      await post.addImages(image);
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        { model: Image },
        {
          model: Comment,
          include: [{ model: User, attributes: ["id", "nickname"] }], //댓글 작성자
        },
        { model: User, attributes: ["id", "nickname"] }, //게시글 작성자
        { model: User, as: "Likers", attributes: ["id"] }, //좋아요 누른 사람
      ],
    });

    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:postId", async (req, res, next) => {
  // GET /post/1
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(404).send("존재하지 않는 게시글 입니다.");
    }

    const fullPost = await Post.findOne({
      where: { id: post.id },
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

    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//만약에 이미지가 한장이라면 upload.single("image") // 이미지가 아닌 text json 등등이다. upload.none()
router.post("/images", isLoggedIn, upload.array("image"), (req, res, next) => {
  //POST /post/images
  try {
    console.log(req.files);
    res.json(req.files.map((e) => e.location)); // local에선 e.filename이였지만 S3에 올릴땐 location
  } catch (error) {
    console.error();
    next(error);
  }
});

router.post("/:postId/retweet", isLoggedIn, async (req, res, next) => {
  // POST /post/1/retweet
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [
        {
          model: Post,
          as: "Retweet",
        },
      ],
    });

    if (!post) {
      return res.status(403).send("해당 게시물이 존재하지 않습니다.");
    }

    if (
      req.user.id === post.UserId ||
      (post.Retweet && post.Retweet.UserId === req.user.id)
    ) {
      //자신의 게시글이거나 자신의 게시글을 Retweet한 게시글을 다시 Retweet한 것을 막는 것
      return res.status(403).send("자신의 게시글은 리트윗이 불가능합니다.");
    }

    const retweetTargetId = post.RetweetId || post.id; //RetweetId가 있는 경우 RetweetId, 아닌경우 post의 id

    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    if (exPost) {
      //이미 리트윗 한 Post를 또 Retweet하는경우
      return res.status(403).send("이미 리트윗한 게시글 입니다.");
    }

    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: "리트윗",
    });

    const retweetWithPrevPost = await Post.findOne({
      where: {
        id: retweet.id,
      },
      include: [
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
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(201).json(retweetWithPrevPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  // POST /post/1/comment
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(403).send("해당 게시물이 존재하지 않습니다.");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId,
      UserId: req.user.id,
    });

    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  // PATCH /post/1/like

  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(403).send("존재하지 않는 짹짹 입니다.");
    }
    await post.addLikers(req.user.id); // 시퀄라이즈
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
  // DELETE /post/1/like

  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(403).send("존재하지 않는 짹짹 입니다.");
    }

    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:postId", isLoggedIn, async (req, res) => {
  //DELETE /post/1/
  try {
    await Post.destroy({
      where: { id: req.params.postId, UserId: req.user.id },
    });

    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
