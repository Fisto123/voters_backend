export const CandidateModel = (sequelize, DataTypes) => {
  const Candidate = sequelize.define("candidate", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    electionid: { type: DataTypes.INTEGER, allowNull: true },
    positionid: { type: DataTypes.INTEGER, allowNull: true },
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    profile: { type: DataTypes.STRING, allowNull: false },
    totalvotes: { type: DataTypes.INTEGER, defaultValue: 0 },
  });

  return Candidate;
};
