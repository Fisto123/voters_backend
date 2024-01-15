import db from "../models/index.js";

let User = db.user;
let Election = db.election;
let Position = db.position;
let Candidate = db.candidate;

export const deleteVoter = async (req, res, next) => {
  let { userid } = req.params;
  if (userid) {
    await User.update(
      {
        status: false,
      },
      { where: { id: userid } }
    );
    return res.status(200).send({ message: "Voter deleted successfully" });
  }
  try {
  } catch (error) {
    next(error);
  }
};

export const deleteElection = async (req, res, next) => {
  let { electionid } = req.params;
  if (electionid) {
    await Election.update(
      {
        status: false,
      },
      { where: { electionid } }
    );
    return res.status(200).send({ message: "Election deleted successfully" });
  }
  try {
  } catch (error) {
    next(error);
  }
};

export const deleteposition = async (req, res, next) => {
  let { electionid, positionid } = req.params;
  if (electionid) {
    await Position.update(
      {
        status: false,
      },
      { where: { electionid, id: positionid } }
    );
    return res.status(200).send({ message: "Position deleted successfully" });
  }
  try {
  } catch (error) {
    next(error);
  }
};

export const deleteCandidate = async (req, res, next) => {
  let { candidateid, electionid } = req.params;
  if (electionid) {
    await Candidate.update(
      {
        status: false,
      },
      { where: { id: candidateid, electionid } }
    );
    return res.status(200).send({ message: "candidate deleted successfully" });
  }
  try {
  } catch (error) {
    next(error);
  }
};

// /deletecandidate/:candidateid/:electionid/:adminid

// /deleteevoter/:idnumber/electionid/:adminid
