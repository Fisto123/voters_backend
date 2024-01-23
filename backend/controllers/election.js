import moment from "moment";
import db from "../models/index.js";
import {
  editElectionSchema,
  electionSchema,
} from "../validations/election/election.js";
const Election = db.election;
const Voter = db.evoter;
const Candidate = db.candidate;
const Position = db.position;
const Ballot = db.ballot;

export const createElection = async (req, res, next) => {
  const {
    electionname,
    electionacronym,
    captionimage,
    generalinstruction,
    startdate,
    enddate,
    votersresultlink,
    skipvotes,
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
        votersresultlink,
        skipvotes,
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
      votersresultlink,
      skipvotes,
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
    votersresultlink,
    skipvotes,
    startdate,
    enddate,
  } = req.body;

  try {
    let id = req.user.id;
    let election = await Election.findOne({ where: { electionid } });

    if (!election) {
      return res.status(404).send({ message: "Election doesn't exist" });
    } else if (election?.published) {
      return res
        .status(404)
        .send({ message: "You cant edit already published election" });
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
          votersresultlink,
          skipvotes,
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
  let { electionid } = req.params;
  let election = await Election.findOne({ where: { electionid } });
  try {
    let id = req.user.id;
    if (id !== election.adminid) {
      return res
        .status(404)
        .send("you can only publish election that you created");
    } else {
      await Election.update(
        {
          published: true,
          datepublished: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          where: { electionid },
        }
      );
      return res
        .status(200)
        .send({ message: "Election published successfully" });
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

export const getElectionVoterz = async (req, res, next) => {
  let { electionid } = req.params;
  let elect = await Election.findOne({ where: { electionid } });
  console.log(req.user.id, req.user.email);
  let voter = await Voter.findOne({
    where: { email: req.user.email, id: req.user.id },
  });
  console.log(voter);

  try {
    if (!elect) {
      return res.status(404).send({ message: "Election doesnt exist " });
    } else {
      if (voter) {
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
export const getVoteStatus = async (req, res, next) => {
  let { electionid } = req.params;
  let elect = await Election.findOne({ where: { electionid } });
  try {
    if (!elect) {
      return res.status(404).send({ message: "Election doesnt exist " });
    } else {
      let getstatus = await Voter.findOne({
        where: { electionid, id: req.user.id },
        attributes: ["voted"],
      });
      return res.status(200).send(getstatus);
    }
  } catch (error) {
    next(error);
  }
};

export const editElectionDate = async (req, res, next) => {
  let { electionid } = req.params;
  const { startdate, enddate } = req.body;

  try {
    let id = req.user.id;
    let election = await Election.findOne({ where: { electionid } });

    if (!election) {
      return res.status(404).send({ message: "Election doesn't exist" });
    } else if (id !== election?.adminid) {
      return res
        .status(403)
        .send({ message: "You can only update your own resource" });
    } else {
      await Election.update(
        {
          startdate,
          enddate,
        },
        { where: { electionid } }
      );

      return res
        .status(200)
        .send({ message: "Election date updated successfully" });
    }
  } catch (error) {
    next(error);
  }
};

export const electionReport = async (req, res, next) => {
  let { electionid } = req.params;

  try {
    let election = await Election.findOne({
      where: { electionid },
    });

    if (!election) {
      return res.status(404).send({ message: "Election doesn't exist" });
    } else if (req.user.id !== election?.adminid) {
      return res.status(403).send({ message: "You don't have permission" });
    }

    let positions = await Position.findAll({
      where: { electionid: election.electionid },
      attributes: ["id", "positionname", "updatedAt"],
    });

    let candidates = await Candidate.findAll({
      where: { electionid: election.electionid },
      attributes: ["id", "fullname", "positionid", "captionimage"],
    });

    let RegisteredVoters = await Voter.count({
      where: { electionid },
    });

    // Fetch unique voter IDs from Ballot table
    const uniqueVoterIds = await Ballot.findAll({
      attributes: ["voterid"],
      where: { electionid },
      group: ["voterid"],
    });

    const uniqueVoterCount = uniqueVoterIds.length;

    // Organize candidates by position with total votes
    const candidatesByPosition = {};

    // Iterate through candidates and positions
    for (const candidate of candidates) {
      const positionId = candidate.positionid;

      // Initialize an empty array for candidates if it doesn't exist
      if (!candidatesByPosition[positionId]) {
        candidatesByPosition[positionId] = [];
      }

      // Fetch the total votes for the candidate in their position
      const totalVotes = await Ballot.count({
        where: { candidateid: candidate.id },
      });

      // Push candidate details along with total votes to the array
      candidatesByPosition[positionId].push({
        id: candidate.id,
        fullname: candidate.fullname,
        captionimage: candidate.captionimage,
        totalVotes: totalVotes,
      });
    }

    // Organize positions with associated candidates and total votes
    const positionsWithCandidates = positions.map((position) => {
      return {
        id: position.id,
        positionname: position.positionname,
        updatedAt: position.updatedAt,
        candidates: candidatesByPosition[position.id] || [],
      };
    });

    // Format the response
    const result = {
      election: {
        id: election.id,
        electionname: election.electionname,
        captionimage: election.captionimage,
        datepublished: election.datepublished,
        votersresultlink: election.votersresultlink,
        skipvotes: election.skipvotes,
        startdate: election.startdate,
        enddate: election.enddate,
        totalvoters: RegisteredVoters,
        uniquevotercount: uniqueVoterCount,
      },
      positions: positionsWithCandidates,
    };

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error in electionReport:", error);
    next(error);
  }
};

// export const electionReport = async (req, res, next) => {
//   let { electionid } = req.params;

//   try {
//     let election = await Election.findOne({
//       where: { electionid },
//     });

//     if (!election) {
//       return res.status(404).send({ message: "Election doesn't exist" });
//     } else if (req.user.id !== election?.adminid) {
//       return res.status(403).send({ message: "You don't have permission" });
//     }

//     let positions = await Position.findAll({
//       where: { electionid: election.electionid },
//       attributes: ["id", "positionname"],
//     });

//     let candidates = await Candidate.findAll({
//       where: { electionid: election.electionid },
//       attributes: ["id", "fullname", "positionid"],
//     });

//     let RegisteredVoters = await Voter.count({
//       where: { electionid },
//     });

//     // Organize candidates by position with total votes
//     const candidatesByPosition = {};

//     // Iterate through candidates and positions
//     for (const candidate of candidates) {
//       const positionId = candidate.positionid;

//       // Initialize an empty array for candidates if it doesn't exist
//       if (!candidatesByPosition[positionId]) {
//         candidatesByPosition[positionId] = [];
//       }

//       // Fetch the total votes for the candidate in their position
//       const totalVotes = await Ballot.count({
//         where: { candidateid: candidate.id },
//       });

//       // Push candidate details along with total votes to the array
//       candidatesByPosition[positionId].push({
//         id: candidate.id,
//         fullname: candidate.fullname,
//         captionimage: candidate.captionimage,
//         totalVotes: totalVotes,
//       });
//     }

//     // Organize positions with associated candidates and total votes
//     const positionsWithCandidates = positions.map((position) => {
//       return {
//         id: position.id,
//         positionname: position.positionname,
//         updatedAt: position.updatedAt,
//         candidates: candidatesByPosition[position.id] || [],
//       };
//     });

//     // Format the response
//     const result = {
//       election: {
//         id: election.id,
//         electionname: election.electionname,
//         captionimage: election.captionimage,
//         datepublished: election.datepublished,
//         votersresultlink: election.votersresultlink,
//         skipvotes: election.skipvotes,
//         startdate: election.startdate,
//         enddate: election.enddate,
//         totalvoters: RegisteredVoters,
//       },
//       positions: positionsWithCandidates,
//     };

//     return res.status(200).send(result);
//   } catch (error) {
//     console.error("Error in electionReport:", error);
//     next(error);
//   }
// };

export const getResultStatus = async (req, res, next) => {
  let { electionid } = req.params;
  let elect = await Election.findOne({ where: { electionid } });
  try {
    if (!elect) {
      return res.status(404).send({ message: "Election doesnt exist " });
    } else {
      let viewresult = await Election.findOne({
        where: { electionid },
        attributes: ["votersresultlink"],
      });
      return res.status(200).send({ viewresult });
    }
  } catch (error) {
    next(error);
  }
};
