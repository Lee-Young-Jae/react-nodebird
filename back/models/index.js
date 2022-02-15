const Sequelize = require("sequelize");
const comment = require("./comment");
const hashtag = require("./hashtag");
const health = require("./health");
const image = require("./image");
const post = require("./post");
const user = require("./user");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.Comment = comment;
db.Hashtag = hashtag;
db.Health = health;
db.Image = image;
db.Post = post;
db.User = user;

Object.keys(db).forEach((modelName) => {
  db[modelName].init(sequelize);
});
// db.Post = require("./post")(sequelize, Sequelize); //함수를 바로 실행
// db.User = require("./user")(sequelize, Sequelize);
// db.Hashtag = require("./hashtag")(sequelize, Sequelize);
// db.Image = require("./image")(sequelize, Sequelize);
// db.Health = require("./health")(sequelize, Sequelize);

//각 관계들 연결해주기
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
// sequelize에 각 모델들이 등록된다.

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
