export const EvoterModel = (sequelize, DataTypes) => {
  const Evoter = sequelize.define("evoter", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    electionid: { type: DataTypes.UUID, allowNull: true },
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
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    profile: { type: DataTypes.STRING, allowNull: false },
    phonenumber: { type: DataTypes.STRING, allowNull: false },
    profilepicture: { type: DataTypes.STRING, allowNull: true },
    codesent: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    electioncode: { type: DataTypes.STRING, allowNull: false, unique: true },
    datecreated: { type: DataTypes.DATE, allowNull: true },
  });

  return Evoter;
};
