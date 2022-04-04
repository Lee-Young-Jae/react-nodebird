const express = require("express");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const postsRouter = require("./routes/posts");
const hashtagRouter = require("./routes/hashtag");
const db = require("./models");
const cors = require("cors");
const passportConfig = require("./passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const hpp = require("hpp");
const helmet = require("helmet");

dotenv.config();
const app = express(); //express 서버

// DB모델 연결 backend 서버의 핵심은 app.js에서~
db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

passportConfig();

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: ["http://dev-ori.com", "http://www.dev-ori.com"], // 실 서비스에선 서비스 주소를 기입한다. 또한 true로 해두면 보낸곳의 주소가 자동으로 들어가기 때문에 편리하다.
      credentials: true, // cors 모듈에서 쿠키 또한 공유가 되도록 한다.
    })
  );
} else {
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: true, // 실 서비스에선 서비스 주소를 기입한다. 또한 true로 해두면 보낸곳의 주소가 자동으로 들어가기 때문에 편리하다.
      credentials: true, // cors 모듈에서 쿠키 또한 공유가 되도록 한다.
    })
  ); //cors 모든 요청에  res.setHeader("Access-Control-Allow-Origin", "*"); 을 넣어준다.
}

// 라우터 연결보다 위에 작성해야하는 코드 미들웨어  use() 메서드는 express에 미들웨어를 장착하게 해준다.

// 프론트로부터 post, fetch 등으로 받은 데이터를 req.body 안에 넣어주는 역할
app.use("/", express.static(path.join(__dirname, "uploads"))); //__dirname(현재 디렉토리)의 upload디렉토리를 합쳐준다. __dirname + '\upload' 안하는 이유는? 운영체제마다 디렉토리 주소 시스템이 다르기 때문 (ex \upload /upload 등등)
app.use(express.json()); // front에서 json형식으로 데이터를 보냈을때 이걸 json 형식으로 req.body에
app.use(express.urlencoded({ extended: true })); //form에서 submit 했을때 urlencoded방식으로 넘어오기때문에 이걸 req.body에
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET, //쿠키를 해싱할 해싱값
    //배포 쿠키옵션
    cookie: {
      httpOnly: true,
      secure: false,
      domain: process.env.NODE_ENV === "production" && ".dev-ori.com", // .을 붙여야 api.dev-ori와 www.dev-ori 그냥 dev-ori 사이에서 쿠키 교환가능
    },
  })
);
app.use(passport.initialize()); //passport 세션
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("hello express");
});

app.get("/", (req, res) => {
  res.send("hello api");
});

// 라우터
app.use("/post", postRouter); //prefix로 /post를 붙인다.
app.use("/user", userRouter); //prefix로 /user를 붙인다.
app.use("/posts", postsRouter); //prefix로 /posts를 붙인다.
app.use("/hashtag", hashtagRouter); //prefix로 /hashtag를 붙인다.
// 매개변수가 4개이면 에러처리 미들웨어 next("에러") 를 처리하는 부분 (커스텀 안하고 싶으면 안써도 된다)
// app.use((err, req, res, next) => {});

app.listen(80, () => {
  // 실서버 :80  // 개발서버 :3060
  console.log("서버 실행 중!");
});
