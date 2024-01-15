export const ElectionModel = (sequelize, DataTypes) => {
  const Election = sequelize.define("election", {
    electionid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    adminid: { type: DataTypes.INTEGER, allowNull: false },
    electionname: { type: DataTypes.STRING, allowNull: false },
    details: { type: DataTypes.STRING, allowNull: false },
    captionimage: { type: DataTypes.STRING, allowNull: false },
    datetimestart: { type: DataTypes.DATE, allowNull: true },
    datetimeend: { type: DataTypes.DATE, allowNull: true },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: { type: DataTypes.BOOLEAN, defaultValue: true },
  });

  return Election;
};
