// table ballot
export const BallotModel = (sequelize, DataTypes) => {
  const Ballot = sequelize.define("ballot", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    electionid: { type: DataTypes.INTEGER, allowNull: true },
    positionid: { type: DataTypes.INTEGER, allowNull: true },
    candidateid: { type: DataTypes.INTEGER, allowNull: true },
    voterid: { type: DataTypes.INTEGER, allowNull: true },
    datecreated: { type: DataTypes.DATE, allowNull: true },
  });

  return Ballot;
};
