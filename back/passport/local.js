const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local"); // Strategy: LocalStrategy as라고 생각하기 Strategy그대로 써도 되지만 나중에 카카오 로그인 등 기능구현할때 KaKaoStrategy 이런식으로 네이밍 하기 위함
const bcrypt = require("bcrypt");

const { User } = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy( //Strategy는 local이름으로 등록된다. user.js에서 passport.authenticate("local" ... ) 로 사용
      {
        usernameField: "email",
        passwordField: "password", //req.body 에 대한 설정이라고 보기, req.body.nickname으로 주어졌다면 여기도 "nickname"
      },
      async (email, password, done) => {
        console.log("passport/local.js | LocalStrategy 생성자 함수");
        try {
          const user = await User.findOne({
            where: {
              email: email,
            },
          });
          if (!user) {
            return done(null, false, {
              //passport는 응답을 보내주지 않는다 ex) res.send('이런거 안합니다.') | 대신 done()으로 결과를 판단해주는데 done(서버에러, 성공, 클라이언트 에러)
              reason: "존재하지 않는 이메일 입니다!",
            }); //done(서버에러, 성공, 클라이언트 에러)
          }
          const result = await bcrypt.compare(password, user.password); //암호화된 데이터베이스의 password와 입력한 password 비교 같다면 true // 얘도 비동기함수
          if (result) {
            return done(null, user);
          }
          return done(null, false, { reason: "비밀번호가 틀렸습니다." });
        } catch (error) {
          console.error(error);
          return done(error); //서버 즉 여기에서 에러가 발생했다면 catch구문에서 잡히기 때문에 done()의 첫번째 인자로 error를 넣어준다
        }
      }
    )
  );
};
