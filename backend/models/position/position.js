export const PositionModel = (sequelize, DataTypes) => {
  const Position = sequelize.define("position", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    adminid: { type: DataTypes.INTEGER, allowNull: false },
    electionid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    positionname: { type: DataTypes.STRING, allowNull: false },
    votersinstruction: { type: DataTypes.STRING, allowNull: true },
    votenumber: { type: DataTypes.INTEGER, defaultValue: 1 },
    status: { type: DataTypes.BOOLEAN, defaultValue: true },
  });

  return Position;
};
