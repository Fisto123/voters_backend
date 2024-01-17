import db from "../models/index.js";
import {
  editElectionSchema,
  electionSchema,
} from "../validations/election/election.js";
const Election = db.election;

export const createElection = async (req, res, next) => {
  const {
    electionname,
    electionacronym,
    captionimage,
    generalinstruction,
    startdate,
    enddate,
  } = req.body;
  try {
    let id = req.user.id;
    await electionSchema.validate(
      {
        electionname,
        electionacronym,
        captionimage,
        generalinstruction,
        startdate,
        enddate,
      },
      {
        abortEarly: false,
      }
    );

    await Election.create({
      adminid: id,
      electionname,
      electionacronym,
      generalinstruction,
      captionimage,
      startdate,
      enddate,
    });
    return res.status(200).send("election created successfully");
  } catch (error) {
    next(error);
  }
};
export const editElection = async (req, res, next) => {
  let { electionid } = req.params;
  const {
    electionname,
    electionacronym,
    generalinstruction,
    captionimage,
    datetimeend,
    startdate,
    enddate,
  } = req.body;

  try {
    let id = req.user.id;
    let election = await Election.findOne({ where: { electionid } });

    await editElectionSchema.validate(
      {
        electionname,
        electionacronym,
        generalinstruction,
        captionimage,
        datetimeend,
        startdate,
        enddate,
      },
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
        {
          electionname,
          electionacronym,
          captionimage,
          generalinstruction,
          startdate,
          enddate,
        },
        { where: { electionid } }
      );

      return res.status(200).send({ message: "Election updated successfully" });
    }
  } catch (error) {
    next(error);
  }
};

export const publishElection = async (req, res, next) => {
  let { electionid, positionid } = req.params;
  let election = await Election.findOne({ where: { electionid } });
  try {
    let {
      votersinstruction,
      votenumber,
      datetimestart,
      datetimeend,
      published,
    } = req.body;
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

export const getAdminElection = async (req, res, next) => {
  let election = await Election.findAll({
    where: { adminid: req.user.id },
    order: [["createdAt", "DESC"]],
  });
  try {
    return res.status(200).send(election);
  } catch (error) {
    next(error);
  }
};

export const getElection = async (req, res, next) => {
  let { electionid } = req.params;
  let elect = await Election.findOne({ where: { electionid } });
  try {
    if (!elect) {
      return res.status(404).send({ message: "Election doesnt exist " });
    } else {
      if (req.user.id === elect.adminid) {
        let election = await Election.findOne({
          where: { electionid },
        });
        return res.status(200).send(election);
      } else {
        return res
          .status(404)
          .send({ message: "can only view your election details" });
      }
    }
  } catch (error) {
    next(error);
  }
};
