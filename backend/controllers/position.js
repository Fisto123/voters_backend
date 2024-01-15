import db from "../models/index.js";
const Position = db.position;

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
      return res.status(404).send("unable to post position");
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
  let { positionname } = req.body;

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
        await Position.update({ positionname }, { where: { id: positionid } });
        return res.status(200).send({
          message: "lesson updated successfully",
        });
      }
    }
  } catch (error) {
    next(error);
  }
};
