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
  let { positionid } = req.params;
  let position = await Position.findOne({ where: { id: positionid } });
  if (req.user.id !== position.adminid) {
    return res.status(403).send("Can only delete your resource");
  } else {
    if (positionid) {
      await Position.update(
        {
          status: false,
        },
        { where: { id: positionid } }
      );
      return res.status(200).send("Position deleted successfully");
    }
  }

  try {
  } catch (error) {
    next(error);
  }
};

export const deleteCandidate = async (req, res, next) => {
  let { candidateid } = req.params;
  let cand = await Candidate.findOne({ candidateid });

  try {
    if (cand?.adminid !== req.user.id) {
      return res.status(403).send({ message: "Can only delete your resource" });
    } else {
      if (candidateid) {
        await Candidate.update(
          {
            status: false,
          },
          { where: { id: candidateid } }
        );
        return res.status(200).send("Candidate deleted successfully");
      }
    }
  } catch (error) {
    next(error);
  }
};
export const ElectionData = async (req, res, next) => {
  let { electionid } = req.params;
  try {
    let candidates = await Candidate.findAll({
      where: { electionid },
      attributes: ["positionid", "firstname", "lastname"],
    });

    // Use Promise.all to wait for all the promises to resolve
    let results = await Promise.all(
      candidates.map(async (candidate) => {
        const positionDetails = await Position.findAll({
          where: { id: candidate.positionid },
          attributes: ["positionname"],
        });
        console.log(positionDetails);

        // Extract the positionname from the first item in the array
        const positionName =
          positionDetails.length > 0 ? positionDetails[0].positionname : null;

        return {
          firstname: candidate.firstname,
          lastname: candidate.lastname,
          position: positionName,
        };
      })
    );

    return res.status(200).send(results);
  } catch (error) {
    next(error);
  }
};

export const getElectionVoter = async (req, res, next) => {
  let { electionid } = req.params;
  try {
    let election = await Election.findOne({ where: { electionid } });
    if (!election) {
      return res.status(404).send({ message: "election doesnt exist" });
    } else {
      let results = await Election.findAll({ where: { electionid } });
      return res.status(200).send(results);
    }
  } catch (error) {
    next(error);
  }
};
