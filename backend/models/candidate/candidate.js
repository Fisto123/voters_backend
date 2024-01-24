export const CandidateModel = (sequelize, DataTypes) => {
  const Candidate = sequelize.define("candidate", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    adminid: { type: DataTypes.INTEGER, allowNull: false },
    electionid: { type: DataTypes.UUID, allowNull: false },
    positionid: { type: DataTypes.INTEGER, allowNull: false },
    fullname: { type: DataTypes.STRING, allowNull: false },
    profile: { type: DataTypes.STRING, allowNull: false },
    totalvotes: { type: DataTypes.INTEGER, defaultValue: 0 },
    captionimage: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.BOOLEAN, defaultValue: true },
  });

  return Candidate;
};
