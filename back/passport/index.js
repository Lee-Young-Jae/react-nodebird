const passport = require("passport");
const local = require("./local");
const { User } = require("../models");

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log("passport/index.js | passport.serializeUser()함수 실행");
    done(null, user.id); //user의 정보중에서 user.id만 쿠키랑 엮어준다.
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({
        where: { id },
      });
      done(null, user); //req.user 안에 넣어준다
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
};
