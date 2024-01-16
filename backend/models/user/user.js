export const userModel = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    firstname: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Please provide a valid email address",
        },
      },
    },
    lastname: { type: DataTypes.STRING, allowNull: false },
    hashpassword: { type: DataTypes.STRING, allowNull: false },
    activationcode: { type: DataTypes.INTEGER, allowNull: true },
    forgotcode: { type: DataTypes.INTEGER, allowNull: true },
    phonenumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    dateactivated: { type: DataTypes.DATE, allowNull: true },
    datedeactivated: { type: DataTypes.DATE, allowNull: true },
  });

  return User;
};
