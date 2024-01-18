import db, { sequelize } from "../models/index.js";
const Position = db.position;
const Election = db.election;
const Candidate = db.candidate;

export const createPosition = async (req, res, next) => {
  const { positions } = req.body;
  let { electionid } = req.params;
  let id = req.user.id;

  const positionDataArray = positions.map((data) => ({
    electionid,
    adminid: id,
    positionname: data.positionname,
  }));
  try {
    if (electionid) {
      await Position.bulkCreate(positionDataArray);
      return res.status(200).send("position created successfully");
    } else {
      return res.status(404).send({ message: "unable to post position" });
    }
  } catch (error) {
    next(error);
  }
};
export const EditPosition = async (req, res, next) => {
  let { positionid } = req.params;
  let id = req.user.id;

  const position = await Position.findOne({
    where: {
      id: positionid,
    },
  });
  let { positionname, votersinstruction } = req.body;

  try {
    if (!position) {
      return res.status(404).send({
        message: "Position doesnt exist",
      });
    } else {
      if (id !== position?.adminid) {
        return res.status(404).send({
          message: "You can only update your resource",
        });
      } else {
        await Position.update(
          { positionname, votersinstruction },
          { where: { id: positionid } }
        );
        return res.status(200).send("Position updated successfully");
      }
    }
  } catch (error) {
    next(error);
  }
};

export const AdminPositions2 = async (req, res, next) => {
  let { electionid } = req.params;
  try {
    const election = await Election.findOne({
      where: {
        electionid,
      },
    });
    if (!election) {
      return res.status(404).send({
        message: "Election doesnt exist",
      });
    } else if (election.adminid !== req.user.id) {
      return res.status(403).send({
        message: "You can only get your resource",
      });
    } else {
      let positions = await Position.findAll({
        where: { electionid, adminid: req.user.id, status: true },
        include: [
          {
            model: Candidate,
            as: "pos",
          },
        ],
      });
      return res.status(200).send(positions);
    }
  } catch (error) {
    next(error);
  }
};

export const getPosition = async (req, res, next) => {
  let { electionid, positionid } = req.params;
  try {
    let positiondetails = await Position.findOne({
      where: { id: positionid, electionid },
    });
    if (!positiondetails) {
      return res.status(404).send({ message: "position doesnt exist" });
    } else {
      let positions = await Position.findOne({
        where: { id: positionid, electionid, adminid: req.user.id },
      });
      return res.status(200).send(positions);
    }
  } catch (error) {
    next(error);
  }
};

// export const AdminPositions = async (req, res, next) => {
//   let { electionid } = req.params;
//   try {
//     const election = await Election.findOne({
//       where: {
//         electionid,
//       },
//     });
//     if (!election) {
//       return res.status(404).send({
//         message: "Election doesnt exist",
//       });
//     } else if (election.adminid !== req.user.id) {
//       return res.status(403).send({
//         message: "You can only get your resource",
//       });
//     } else {
//       let positions = await Position.findAll({
//         where: { electionid, adminid: req.user.id, status: true },
//       });
//       return res.status(200).send(positions);
//     }
//   } catch (error) {
//     next(error);
//   }
// };

export const AdminPositions = async (req, res, next) => {
  let { electionid } = req.params;
  try {
    const election = await Election.findOne({
      where: {
        electionid,
      },
    });

    if (!election) {
      return res.status(404).send({
        message: "Election doesn't exist",
      });
    } else if (election.adminid !== req.user.id) {
      return res.status(403).send({
        message: "You can only get your resource",
      });
    } else {
      let positions = await Position.findAll({
        where: { electionid, adminid: req.user.id, status: true },
      });

      // Fetch the number of contestants for each position
      const positionsWithContestants = await Promise.all(
        positions.map(async (position) => {
          const numberOfContestants = await Candidate.count({
            where: { positionid: position.id },
          });

          return {
            ...position.toJSON(),
            contestants: numberOfContestants,
          };
        })
      );

      return res.status(200).send(positionsWithContestants);
    }
  } catch (error) {
    next(error);
  }
};
