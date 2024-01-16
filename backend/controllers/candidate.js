import db from "../models/index.js";

// /addcandidates/:electionid/:positionid
const Candidate = db.candidate;
export const createCandidates = async (req, res, next) => {
  const { candidates } = req.body;
  let { electionid, positionid } = req.params;
  let adminid = req.user.id;

  const candidateDataArray = candidates.map((data) => ({
    electionid,
    positionid,
    firstname: data.firstname,
    lastname: data.lastname,
    profile: data.profile,
    adminid,
  }));
  try {
    if (electionid && positionid && adminid) {
      await Candidate.bulkCreate(candidateDataArray);
      return res.status(200).send("candidates created successfully");
    } else {
      return res.status(404).send("unable to post position");
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
