// login 여부 검사 미들웨어
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    // passport에서 제공 if (req.user) {} 해도 된다
    next(); // 인자를 넣으면 에러를 처리하고 그냥 next()는 다음 미들웨어에서 작업을 이어간다.
  } else {
    res.status(401).send("로그인이 필요합니다.");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("로그인하지 않은 사용자만 접근 가능합니다.");
  }
};
