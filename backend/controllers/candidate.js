import db from "../models/index.js";

// /addcandidates/:electionid/:positionid
const Candidate = db.candidate;
const Position = db.position;

export const createCandidate = async (req, res, next) => {
  const { fullname, profile, captionimage } = req.body;
  let { electionid, positionid } = req.params;
  let adminid = req.user.id;

  try {
    if (electionid && positionid && adminid) {
      await Candidate.create({
        fullname,
        profile,
        captionimage,
        electionid,
        adminid,
        positionid,
      });
      return res.status(200).send("success");
    } else {
      return res.status(404).send("Unable to post candidate");
    }
  } catch (error) {
    next(error);
  }
};

export const updateCandidatePicture = async (req, res, next) => {
  let { candidateid, electionid, positionid } = req.params;
  let { profilepix } = req.body;
  let candidate = await Candidate.findOne({
    where: {
      id: candidateid,
      electionid,
      positionid,
    },
  });

  try {
    if (!candidate) {
      return res.status(404).send("candidate doesnt exist");
    } else {
      if (req.user.id !== candidate.adminid) {
        return res
          .status(404)
          .send({ message: "Cant update candidate outside your organization" });
      }
      await Candidate.update(
        { profilepix },
        {
          where: {
            id: candidateid,
            electionid,
            positionid,
          },
        }
      );
      return res.status(200).send("candidate picture updated successfully");
    }
  } catch (error) {
    next(error);
  }
};

export const getCandidates = async (req, res, next) => {
  let { positionid } = req.params;
  let singleposition = await Position.findOne({
    where: { id: positionid },
  });
  try {
    if (!singleposition) {
      return res.status(404).send({ message: "invalid position" });
    } else {
      let position = await Candidate.findAll({
        where: { positionid, adminid: req.user.id, status: true },
      });
      return res.status(200).send(position);
    }
  } catch (error) {
    next(error);
  }
};

export const editCandidate = async (req, res, next) => {
  let { candidateid, positionid } = req.params;
  let { fullname, profile } = req.body;
  let candidate = await Candidate.findOne({
    where: {
      id: candidateid,
      positionid,
    },
  });

  try {
    if (!candidate) {
      return res.status(404).send({ message: "Candidate doesnt exist" });
    } else {
      if (req.user.id !== candidate.adminid) {
        return res
          .status(404)
          .send({ message: "Cant update candidate outside your organization" });
      }
      await Candidate.update(
        { fullname, profile },
        {
          where: {
            id: candidateid,
            positionid,
          },
        }
      );
      return res.status(200).send("success");
    }
  } catch (error) {
    next(error);
  }
};
////positionid to get candidate details  /candidates
