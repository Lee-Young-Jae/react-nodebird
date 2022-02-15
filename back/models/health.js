const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Health extends Model {
  static init(sequelize) {
    return super.init(
      {
        referencedate: {
          type: DataTypes.STRING(11), // STRING, TEXT(긴글), BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: false, //true 선택적, false 필수
        },
        weight: {
          type: DataTypes.INTEGER(5),
          allowNull: false,
        },
      },
      {
        modelName: "Health",
        charset: "utf8",
        collate: "utf8_general_ci", //한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Health.belongsTo(db.User);
  }
};
