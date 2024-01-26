import { Sequelize } from "sequelize";
import db, { sequelize } from "../models/index.js";

let Ballot = db.ballot;
let Voter = db.evoter;
let Position = db.position;
let Candidate = db.candidate;
let Election = db.election;

export const createVote = async (req, res, next) => {
  let { votes } = req.body;
  let { electionid } = req.params;
  let id = req.user.id;
  let user = await Voter.findOne({
    where: { electionid, id, fullname: req.user.fullname },
  });

  const votesDataArray = votes.map((data) => ({
    electionid,
    positionid: data.positionid,
    candidateid: data.candidateid,
    voterid: id,
  }));

  try {
    if (user.voted) {
      return res
        .status(404)
        .send({ message: "Voting more than once is not allowed." });
    } else {
      if (user) {
        await Ballot.bulkCreate(votesDataArray);
        await Voter.update(
          { voted: true },
          { where: { id, electionid: electionid } }
        );
        return res.status(200).send("Voted successfully");
      } else {
        return res.status(404).send({ message: "unable to vote" });
      }
    }
  } catch (error) {
    next(error);
  }
};

export const voteResult = async (req, res, next) => {
  let { electionid } = req.params;
  let election = await Voter.findOne({ where: { electionid } });
  try {
    let user = await Voter.findOne({
      where: { electionid, adminid: req.user.id },
    });

    if (!user) {
      return res.status(404).send({ message: "Election doesn't exist" });
    }
    //  else if (req.user.id !== election?.adminid) {
    //   return res
    //     .status(404)
    //     .send({ message: "Cant view other people resource" });
    // }

    let positions = await Position.findAll({
      attributes: ["id", "positionname"],
      where: { electionid, status: true },
    });
    const resultArray = [];

    for (const position of positions) {
      // Fetch candidates and count the number of votes
      const candidates = await Candidate.findAll({
        attributes: ["id", "fullname"],
        where: { positionid: position.id },
      });

      // Count the number of votes for each candidate
      const votesCounts = await Ballot.findAll({
        attributes: [
          "candidateid",
          [sequelize.fn("COUNT", "id"), "totalvotes"],
        ],
        where: { electionid, positionid: position.id },
        group: ["candidateid"],
        raw: true,
      });

      // Create a map to store the total votes for each candidate
      const votesMap = new Map();
      votesCounts.forEach((result) => {
        votesMap.set(result.candidateid, result.totalvotes);
      });

      // Add the position details and candidate counts to the results array
      resultArray.push({
        positionid: position.id,
        position: position.positionname,
        scores: candidates.map((candidate) => ({
          candidateid: candidate.id,
          candidatename: candidate.fullname,
          totalvotes: votesMap.get(candidate.id) || 0,
        })),
      });
    }

    return res.status(200).send(resultArray);
  } catch (error) {
    next(error);
  }
};

export const votelog = async (req, res, next) => {
  let { electionid } = req.params;
  const resultArray = [];

  try {
    const election = await Election.findOne({
      where: { electionid },
    });

    if (!election) {
      return res.status(404).send({ message: "Election doesn't exist" });
    }

    if (election.skipvotes === true) {
      const positions = await Position.findAll({
        attributes: ["id", "positionname"],
        where: { electionid, status: true },
      });

      await Promise.all(
        positions.map(async (position) => {
          const ballotIds = await Ballot.findAll({
            attributes: ["voterid", "createdAt"], // Include the createdAt field
            where: { electionid, positionid: position.id },
          });

          const voterDetails = await Promise.all(
            ballotIds.map(async (ballot) => {
              const voter = await Voter.findOne({
                attributes: ["id", "fullname", "profile"],
                where: { id: ballot.voterid },
                order: [["createdAt", "DESC"]],
              });

              return {
                id: voter.id,
                fullname: voter.fullname,
                profile: voter.profile,
                votedAt: ballot.createdAt,
              };
            })
          );
          voterDetails.sort((a, b) => a.fullname.localeCompare(b.fullname));

          resultArray.push({
            positionid: position.id,
            positionname: position.positionname,
            voterCount: voterDetails.length,
            voters: voterDetails,
          });
        })
      );

      return res.status(200).send(resultArray);
    }
  } catch (error) {
    next(error);
  }
};

export const VoterResultView = async (req, res, next) => {
  let { electionid } = req.params;

  try {
    let user = await Voter.findOne({ where: { electionid, id: req.user.id } });
    let elect = await Election.findOne({
      where: { electionid },
    });

    if (!user) {
      return res.status(404).send({ message: "you are not permitted to view" });
    }
    if (elect?.votersresultlink === false) {
      return res
        .status(403)
        .send({ message: "you are not permitted to view result" });
    }

    let positions = await Position.findAll({
      attributes: ["id", "positionname"],
      where: { electionid, status: true },
    });
    const resultArray = [];

    for (const position of positions) {
      // Fetch candidates and count the number of votes
      const candidates = await Candidate.findAll({
        attributes: ["id", "fullname"],
        where: { positionid: position.id },
      });

      // Count the number of votes for each candidate
      const votesCounts = await Ballot.findAll({
        attributes: [
          "candidateid",
          [sequelize.fn("COUNT", "id"), "totalvotes"],
        ],
        where: { electionid, positionid: position.id },
        group: ["candidateid"],
        raw: true,
      });

      // Create a map to store the total votes for each candidate
      const votesMap = new Map();
      votesCounts.forEach((result) => {
        votesMap.set(result.candidateid, result.totalvotes);
      });

      // Add the position details and candidate counts to the results array
      resultArray.push({
        positionid: position.id,
        position: position.positionname,
        scores: candidates.map((candidate) => ({
          candidateid: candidate.id,
          candidatename: candidate.fullname,
          totalvotes: votesMap.get(candidate.id) || 0,
        })),
      });
    }

    return res.status(200).send(resultArray);
  } catch (error) {
    next(error);
  }
};
