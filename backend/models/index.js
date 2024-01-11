import { dbConn } from "../config/db.config.js";
import { Sequelize, DataTypes } from "sequelize";
import { CandidateModel } from "./candidate/candidate.js";
import { EvoterModel } from "./evoters/evoter.js";
import { BallotModel } from "./ballot/ballot.js";
import { PositionModel } from "./position/position.js";
import { userModel } from "./user/user.js";
import { ElectionModel } from "./election/election.js";
export const sequelize = new Sequelize(
  dbConn.DB,
  dbConn.USER,
  dbConn.PASSWORD,
  {
    host: dbConn.HOST,
    dialect: dbConn.dialect,
    operatorsAlliases: false,
    pool: {
      max: dbConn.pool.max,
      min: dbConn.pool.min,
      acquire: dbConn.pool.acquire,
      idle: dbConn.pool.idle,
    },
  }
);
sequelize
  .authenticate()
  .then(() => {
    console.log("connected...");
  })
  .catch((error) => console.log(error));

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.candidate = CandidateModel(sequelize, DataTypes);
db.evoter = EvoterModel(sequelize, DataTypes);
db.ballot = BallotModel(sequelize, DataTypes);
db.position = PositionModel(sequelize, DataTypes);
db.user = userModel(sequelize, DataTypes);
db.election = ElectionModel(sequelize, DataTypes);

// db.sequelize.sync({ force: false }).then(() => {
//   console.log("yes re-sync done!!");
// });

// await sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log("Schema updated successfully.");
//   })
//   .catch((error) => {
//     console.error("Schema update error:", error);
//   });

// db.sequelize.sync({ force: true, alter: true }).then(() => {
//   console.log("Hard reset done!!");
// });  "CASCADE",

//RELATIONSHIP BETWEEN USER AND ELECTION
db.user.hasMany(db.election, {
  foreignKey: "adminid",
});
db.election.belongsTo(db.user, {
  foreignKey: "adminid",
  as: "admin",
});

//RELATIONSHIP BETWEEN USER AND ELECTION

export default db;
