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
  let { candidateid, electionid } = req.params;
  if (electionid) {
    await Candidate.update(
      {
        status: false,
      },
      { where: { id: candidateid, electionid } }
    );
    return res.status(200).send({ message: "Candidate deleted successfully" });
  }
  try {
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

//  [
//    {
//      positionid: 1,
//      positionname: "President",
//      candidates: [
//        {
//          candidateid: 34,
//          fullname: "Babajide",
//          profilepicture:
//            "https://staff.yabatech.edu.ng/staffimgg/Passport_redBG.jpg",
//        },
//        {
//          candidateid: 48,
//          fullname: "Chuckwu",
//          profilepicture:
//            "https://staff.yabatech.edu.ng/staffimgg/1582018875mypass.jpg",
//        },
//      ],
//    },
//    {
//      positionid: 2,
//      positionname: "Vice President",
//      candidates: [
//        {
//          candidateid: 12,
//          fullname: "Simisolu",
//          profilepicture:
//            "https://staff.yabatech.edu.ng/staffimgg/1582018875mypass.jpg",
//        },
//        {
//          candidateid: 120,
//          fullname: "Dejo Tufulu",
//          profilepicture:
//            "https://staff.yabatech.edu.ng/staffimgg/Passport_redBG.jpg",
//        },
//        {
//          candidateid: 99,
//          fullname: "Fisto Law",
//          profilepicture:
//            "https://staff.yabatech.edu.ng/staffimgg/1582018875mypass.jpg",
//        },
//      ],
//    },
//  ];
