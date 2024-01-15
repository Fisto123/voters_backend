import db from "../models/index.js";

let Ballot = db.ballot;
let Voter = db.evoter;
export const createVote = async (req, res, next) => {
  let { electionid, positionid, voterid, candidateid } = req.params;
  try {
    if (!electionid || !positionid || !voterid) {
      return res.status(404).send({ message: "fill in all parameters" });
    } else {
      let voteno = await Ballot.count({
        where: { electionid, positionid, voterid },
      });
      let voterstatus = await Voter.findOne({
        where: { id: voterid },
        attributes: ["status"],
      });
      if (voterstatus.status === false) {
        return res
          .status(404)
          .send({ message: "Sorry, you are not permitted to vote" });
      } else {
        if (voteno === 1) {
          return res
            .status(400)
            .send({ message: "Sorry, you cant vote twice" });
        }
        await Ballot.create({ electionid, positionid, voterid, candidateid });
        return res.status(200).send({ message: "Vote successful" });
      }
    }
  } catch (error) {
    next(error);
  }
};
