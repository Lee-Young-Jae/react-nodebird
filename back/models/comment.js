// 기존 시퀄라이저 모델을 class형 (최신)문법으로 바꿔보기.

const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Comment extends Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: DataTypes.TEXT,
          allowNULL: false,
        },
      },
      {
        modelName: "Comment",
        tableName: "comments", //생략해도 된다.
        charset: "utf8mb4", //이모티콘을 위해 utf8mb4
        collate: "utf8mb4_general_ci", //한글 저장
        sequelize, //index에서 만든 연결객체  new Sequelize(config....) 한것을 class로 보내줄 것이기 때문에 여기에 넣어줘야한다.
      }
    );
  }
  static associate(db) {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  }
};
