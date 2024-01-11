export const PositionModel = (sequelize, DataTypes) => {
  const Position = sequelize.define("position", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    adminid: { type: DataTypes.INTEGER, allowNull: true },
    electionid: { type: DataTypes.INTEGER, allowNull: true },
    position: { type: DataTypes.STRING, allowNull: true },
    votersinstructions: { type: DataTypes.STRING, allowNull: true },
    votenumber: { type: DataTypes.INTEGER, allowNull: true },
    datestart: { type: DataTypes.DATE, allowNull: true },
    dateend: { type: DataTypes.DATE, allowNull: true },
    timestart: { type: DataTypes.DATE, allowNull: true },
    timeend: { type: DataTypes.DATE, allowNull: true },
    published: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    captionimage: { type: DataTypes.STRING, allowNull: true },
  });

  return Position;
};
