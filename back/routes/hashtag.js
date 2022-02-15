const express = require("express");
const { Hashtag, User, Image, Comment, Post } = require("../models");
const { Op } = require("sequelize");

const router = express.Router();

router.get("/:hashtag", async (req, res, next) => {
  // GET /hashtag/노드
  try {
    const where = {};
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
          model: Hashtag,
          where: { name: decodeURIComponent(req.params.hashtag) }, //get요청에서 한글 문제로 incoding 된 url를 보내기에 decode
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

module.exports = router;
