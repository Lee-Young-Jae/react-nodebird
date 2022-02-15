const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        // MySQL에 ID는 자동 생성된다~ 1,2,3,4,.....n
        email: {
          type: DataTypes.STRING(30), // STRING, TEXT(긴글), BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: false, //true 선택적, false 필수
          unique: true, //고유한 값이여야 한다.
        },
        nickname: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(100), // 비밀번호는 암호화를 하면 길이가 길어지기 때문에 넉넉하게 잡는다
          allowNull: false,
        },
      },
      {
        modelName: "User",
        tableName: "users",
        charset: "utf8",
        collate: "utf8_general_ci", //한글 저장
        sequelize,
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.hasMany(db.Health);
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" });
    db.User.belongsToMany(db.User, {
      //user.addFollowers()
      through: "Follow",
      as: "Followers",
      foreignKey: "FollowingId",
    });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings",
      foreignKey: "FollowerId",
    });
  }
};

// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define(
//     "User", // mySQL에는 자동으로 users로 테이블이 생성된다. 소문자의 복수형태 규칙
//     {
//       // MySQL에 ID는 자동 생성된다~ 1,2,3,4,.....n
//       email: {
//         type: DataTypes.STRING(30), // STRING, TEXT(긴글), BOOLEAN, INTEGER, FLOAT, DATETIME
//         allowNull: false, //true 선택적, false 필수
//         unique: true, //고유한 값이여야 한다.
//       },
//       nickname: {
//         type: DataTypes.STRING(30),
//         allowNull: false,
//       },
//       password: {
//         type: DataTypes.STRING(100), // 비밀번호는 암호화를 하면 길이가 길어지기 때문에 넉넉하게 잡는다
//         allowNull: false,
//       },
//     },
//     {
//       charset: "utf8",
//       collate: "utf8_general_ci", //한글 저장
//     }
//   );
//   User.associate = (db) => {
//     db.User.hasMany(db.Post);
//     db.User.hasMany(db.Comment);
//     db.User.hasMany(db.Health);
//     db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" });
//     db.User.belongsToMany(db.User, {
//       //user.addFollowers()
//       through: "Follow",
//       as: "Followers",
//       foreignKey: "FollowingId",
//     });
//     db.User.belongsToMany(db.User, {
//       through: "Follow",
//       as: "Followings",
//       foreignKey: "FollowerId",
//     });
//   };
//   return User;
// };
