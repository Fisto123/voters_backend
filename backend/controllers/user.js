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
// export const ElectionData = async (req, res, next) => {
//   let { electionid } = req.params;
//   try {
//     let candidates = await Candidate.findAll({
//       where: { electionid },
//       attributes: ["positionid", "fullname"],
//     });

//     // Use Promise.all to wait for all the promises to resolve
//     let results = await Promise.all(
//       candidates.map(async (candidate) => {
//         const positionDetails = await Position.findAll({
//           where: { id: candidate.positionid },
//           attributes: ["positionname"],
//         });
//         console.log(positionDetails);

//         // Extract the positionname from the first item in the array
//         const positionName =
//           positionDetails.length > 0 ? positionDetails[0].positionname : null;

//         return {
//           fullname: candidate.fullname,
//           positionname: positionName,
//         };
//       })
//     );

//     return res.status(200).send(results);
//   } catch (error) {
//     next(error);
//   }
// };

export const ElectionData = async (req, res, next) => {
  let { electionid } = req.params;

  try {
    // Retrieve all candidates with their positions
    let candidates = await Candidate.findAll({
      where: { electionid, status: true },
      attributes: ["positionid", "fullname", "id", "captionimage"],
    });

    // Retrieve all positions
    let positions = await Position.findAll({
      attributes: ["id", "positionname"],
      where: { electionid, status: true },
    });

    // Create an object to store the results
    let results = [];

    // Iterate through each position
    for (let position of positions) {
      // Find candidates for the current position
      let positionCandidates = candidates.filter(
        (candidate) => candidate.positionid === position.id
      );

      // Create an array of candidates for the current position
      let candidatesArray = positionCandidates.map((candidate) => ({
        candidateid: candidate.id,
        fullname: candidate.fullname,
        profilepicture: candidate.captionimage,
      }));

      // Add the position details and candidates to the results array
      results.push({
        positionid: position.id,
        positionname: position.positionname,
        candidates: candidatesArray,
      });
    }

    return res.status(200).send(results);
  } catch (error) {
    next(error);
  }
};
