const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Post extends Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        modelName: "Post",
        tableName: "posts",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); // post.addHashtags
    db.Post.hasMany(db.Comment); // post.addComments, post.getComments
    db.Post.hasMany(db.Image); // post.addImages, post.getImages
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); // post.addLikers, post.removeLikers
    db.Post.belongsTo(db.Post, { as: "Retweet" }); // post.addRetweet
  }
};

// module.exports = (sequelize, DataTypes) => {
//   const Post = sequelize.define(
//     "Post",
//     {
//       content: {
//         type: DataTypes.TEXT,
//         allowNULL: false,
//       },
//     },
//     {
//       charset: "utf8mb4", //이모티콘을 위해 utf8mb4
//       collate: "utf8mb4_general_ci", //한글 저장
//     }
//   );
//   Post.associate = (db) => {
//     db.Post.belongsTo(db.User); // post.addUser, post.getUser  // 관계 테이블에 add(데이터 추가) get(데이터 가져오기) set(데이터 교체) remove(데이터 삭제)

//     db.Post.hasMany(db.Comment); // post.addComments 가 생긴다 (hasMany라 복수)

//     db.Post.hasMany(db.Image); // post.addImages 가 생긴다 (hasMany라 복수)

//     db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); // post.addHashtags(?) 가 생겼을까..?

//     db.Post.belongsTo(db.Post, { as: "Retweet" }); // post.addRetweet 가 생긴다 (단수)

//     db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); // post.addLikers, post.removeLikers 가 생긴다 (Many라 복수)
//   };
//   return Post;
// };
