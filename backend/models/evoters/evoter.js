export const EvoterModel = (sequelize, DataTypes) => {
  const Evoter = sequelize.define("evoter", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    electionid: { type: DataTypes.INTEGER, allowNull: true },
    idnumber: { type: DataTypes.STRING, allowNull: true },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: "Please provide a valid email address",
        },
      },
    },
    firstname: { type: DataTypes.STRING, allowNull: true },
    lastname: { type: DataTypes.STRING, allowNull: true },
    profile: { type: DataTypes.STRING, allowNull: true },
    phonenumber: { type: DataTypes.STRING, allowNull: true },
    profilepicture: { type: DataTypes.STRING, allowNull: true },
    codesent: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    electioncode: { type: DataTypes.INTEGER, allowNull: true },
    datecreated: { type: DataTypes.DATE, allowNull: true },
  });

  return Evoter;
};
