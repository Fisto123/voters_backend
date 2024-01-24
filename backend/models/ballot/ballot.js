// table ballot
export const BallotModel = (sequelize, DataTypes) => {
  const Ballot = sequelize.define("ballot", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    electionid: { type: DataTypes.UUID, allowNull: false },
    positionid: { type: DataTypes.INTEGER, allowNull: false },
    candidateid: { type: DataTypes.INTEGER, allowNull: false },
    voterid: { type: DataTypes.INTEGER, allowNull: false },
  });

  return Ballot;
};
