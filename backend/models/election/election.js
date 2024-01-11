export const ElectionModel = (sequelize, DataTypes) => {
  const Election = sequelize.define("election", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    adminid: { type: DataTypes.INTEGER, allowNull: true },
    electionid: { type: DataTypes.INTEGER, allowNull: true },
    details: { type: DataTypes.STRING, allowNull: true },
    captionimage: { type: DataTypes.STRING, allowNull: true },
    datestart: { type: DataTypes.DATE, allowNull: true },
    published: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    datecreated: { type: DataTypes.DATE, allowNull: true },
  });

  return Election;
};
