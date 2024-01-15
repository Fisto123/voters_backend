import db from "../models/index.js";
import {
  editElectionSchema,
  electionSchema,
} from "../validations/election/election.js";
const Election = db.election;

export const createElection = async (req, res, next) => {
  const { electionname, details, captionimage, datetimestart, datetimeend } =
    req.body;
  try {
    let id = req.user.id;
    await electionSchema.validate(
      { electionname, details, captionimage, datetimestart, datetimeend },
      {
        abortEarly: false,
      }
    );

    await Election.create({
      adminid: id,
      electionname,
      details,
      captionimage,
      datetimestart,
      datetimeend,
    });
    return res.status(200).send("election created successfully");
  } catch (error) {
    next(error);
  }
};
export const editElection = async (req, res, next) => {
  let { electionid } = req.params;
  const { electionname, details, captionimage, datetimestart, datetimeend } =
    req.body;

  try {
    let id = req.user.id;
    let election = await Election.findOne({ where: { electionid } });

    await editElectionSchema.validate(
      { electionname, details, captionimage, datetimestart, datetimeend },
      { abortEarly: false }
    );

    if (!election) {
      return res.status(404).send({ message: "Election doesn't exist" });
    } else if (id !== election?.adminid) {
      return res
        .status(403)
        .send({ message: "You can only update your own resource" });
    } else {
      await Election.update(
        { electionname, details, captionimage, datetimestart, datetimeend },
        { where: { electionid } }
      );

      return res.status(200).send({ message: "Election updated successfully" });
    }
  } catch (error) {
    next(error);
  }
};

/************* */
export const publishElection = async (req, res, next) => {
  let { electionid, positionid } = req.params;
  let election = await Election.findOne({ where: { electionid } });
  try {
    //conn between electionid and positionid
    let {
      votersinstruction,
      votenumber,
      datetimestart,
      datetimeend,
      published,
    } = req.body;
    console.log(
      votersinstruction,
      votenumber,
      datetimestart,
      datetimeend,
      published
    );
    let id = req.user.id;
    if (id !== election.adminid) {
      return res
        .status(404)
        .send("you can only publish election that you created");
    } else {
      await Election.update(
        {
          votersinstruction,
          votenumber,
          datetimestart,
          datetimeend,
          published,
        },
        {
          where: { electionid },
        }
      );
    }
  } catch (error) {
    next(error);
  }
};
