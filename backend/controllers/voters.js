// processCSV.js
import fs from "fs";
import csv from "csv-parser";
import db, { sequelize } from "../models/index.js";
import { generate8DigitCode } from "../utils/randomcode.js";
import { Op } from "sequelize";
import { sendActivationEmail2 } from "../utils/email.config.js";
import { votersloginSchema } from "../validations/auth/login.js";
import { voterSchema } from "../validations/voters/voter.js";
import { generateToken, generateTokenVoter } from "../utils/token.js";
import axios from "axios";
const Voter = db.evoter;
const election = db.election;

// const processCSV = async (filePath, electionid, adminid) => {
//   return new Promise((resolve, reject) => {
//     const results = [];

//     const stream = fs
//       .createReadStream(filePath)
//       .pipe(csv())
//       .on("data", (data) => {
//         const { firstname, lastname, email, profile, phonenumber } = data;

//         results.push({
//           electionid,
//           firstname,
//           lastname,
//           email,
//           profile,
//           phonenumber,
//           electioncode: generate8DigitCode(),
//           adminid,
//         });
//       })
//       .on("end", async () => {
//         try {
//           // Save the data to the database
//           await Voter.bulkCreate(results);

//           // Resolve the promise when done
//           resolve();
//         } catch (error) {
//           // Reject the promise if there's an error
//           reject(error);
//         } finally {
//           // Remove the temporary file after processing
//           fs.unlinkSync(filePath);
//         }
//       });

//     // Handle stream errors
//     stream.on("error", (error) => {
//       reject(error);
//     });
//   });
// };

// const processCSV = async (filePath, electionid, adminid, batchSize = 100) => {
//   return new Promise((resolve, reject) => {
//     const results = [];
//     let currentBatch = [];

//     const processBatch = async (batch) => {
//       try {
//         // Save the data to the database
//         await Voter.bulkCreate(batch);
//       } catch (error) {
//         // Reject the promise if there's an error
//         reject(error);
//       }
//     };

//     const stream = fs
//       .createReadStream(filePath)
//       .pipe(csv())
//       .on("data", async (data) => {
//         const { firstname, lastname, email, profile, phonenumber } = data;

//         currentBatch.push({
//           electionid,
//           firstname,
//           lastname,
//           email,
//           profile,
//           phonenumber,
//           electioncode: generate8DigitCode(),
//           adminid,
//         });

//         if (currentBatch.length === batchSize) {
//           // Process the current batch asynchronously and reset it
//           results.push(processBatch([...currentBatch]));
//           currentBatch = [];

//           // Wait for the previous batch to complete before processing the next one
//           await Promise.all(results);
//         }
//       })
//       .on("end", async () => {
//         try {
//           // Process the remaining data in the last batch
//           if (currentBatch.length > 0) {
//             results.push(processBatch([...currentBatch]));
//           }

//           // Wait for any remaining batches to complete
//           await Promise.all(results);

//           // Resolve the promise when done
//           resolve();
//         } catch (error) {
//           // Reject the promise if there's an error
//           reject(error);
//         } finally {
//           // Remove the temporary file after processing
//           fs.unlinkSync(filePath);
//         }
//       });

//     // Handle stream errors
//     stream.on("error", (error) => {
//       reject(error);
//     });
//   });
// };
// const processCSV = async (filePath, electionid, adminid, batchSize = 200) => {
//   return new Promise((resolve, reject) => {
//     let currentMaxId = 0; // Variable to keep track of the current maximum id
//     const results = [];
//     let currentBatch = [];

//     const processBatch = async (batch) => {
//       try {
//         // Adjust the id field in the batch based on the current maximum id
//         const adjustedBatch = batch.map((item) => {
//           item.id = ++currentMaxId;
//           return item;
//         });

//         // Save the data to the database
//         await Voter.bulkCreate(adjustedBatch);
//       } catch (error) {
//         // Reject the promise if there's an error
//         reject(error);
//       }
//     };

//     const stream = fs
//       .createReadStream(filePath)
//       .pipe(csv())
//       .on("data", async (data) => {
//         const { fullname, email,idnumber, profile, phonenumber } = data;

//         currentBatch.push({
//           id: null,
//           electionid,
//           fullname,
//           email,
//           profile,
//           idnumber,
//           phonenumber,
//           electioncode: generate8DigitCode(),
//           adminid,
//         });

//         if (currentBatch.length === batchSize) {
//           // Process the current batch asynchronously and reset it
//           results.push(processBatch([...currentBatch]));
//           currentBatch = [];

//           // Wait for the previous batch to complete before processing the next one
//           await Promise.all(results);
//         }
//       })
//       .on("end", async () => {
//         try {
//           // Process the remaining data in the last batch
//           if (currentBatch.length > 0) {
//             results.push(processBatch([...currentBatch]));
//           }

//           // Wait for any remaining batches to complete
//           await Promise.all(results);

//           // Resolve the promise when done
//           resolve();
//         } catch (error) {
//           // Reject the promise if there's an error
//           reject(error);
//         } finally {
//           // Remove the temporary file after processing
//           fs.unlinkSync(filePath);
//         }
//       });

//     // Handle stream errors
//     stream.on("error", (error) => {
//       reject(error);
//     });
//   });
// };

const processCSV = async (filePath, electionid, adminid, batchSize = 200) => {
  return new Promise((resolve, reject) => {
    let currentMaxId = 0; // Variable to keep track of the current maximum id
    const results = [];
    let currentBatch = [];
    let isFirstRow = true; // Flag to track the first row

    const processBatch = async (batch) => {
      try {
        // Save the data to the database
        await Voter.bulkCreate(batch);
      } catch (error) {
        // Reject the promise if there's an error
        reject(error);
      }
    };

    const stream = fs
      .createReadStream(filePath)
      .pipe(
        csv({
          headers: [
            "id",
            "fullname",
            "email",
            "idnumber",
            "phonenumber",
            "profile",
          ],
          mapHeaders: ({ header }) => header.trim(),
        })
      )
      .on("data", async (data) => {
        // Skip the first row (header row)
        if (isFirstRow) {
          isFirstRow = false;
          return;
        }

        const { id, fullname, email, idnumber, phonenumber, profile } = data;

        currentBatch.push({
          electionid,
          fullname,
          email,
          idnumber,
          phonenumber,
          profile,
          electioncode: generate8DigitCode(),
          adminid,
        });

        if (currentBatch.length === batchSize) {
          // Process the current batch asynchronously and reset it
          results.push(processBatch([...currentBatch]));
          currentBatch = [];

          // Wait for the previous batch to complete before processing the next one
          await Promise.all(results);
        }
      })
      .on("end", async () => {
        try {
          // Process the remaining data in the last batch
          if (currentBatch.length > 0) {
            results.push(processBatch([...currentBatch]));
          }

          // Wait for any remaining batches to complete
          await Promise.all(results);

          // Resolve the promise when done
          resolve();
        } catch (error) {
          // Reject the promise if there's an error
          reject(error);
        } finally {
          // Remove the temporary file after processing
          fs.unlinkSync(filePath);
        }
      });

    // Handle stream errors
    stream.on("error", (error) => {
      reject(error);
    });
  });
};

const isCodeDuplicate = async (code, currentRecordId) => {
  // Check if the code already exists in the database, excluding the current record
  const existingRecord = await Voter.findOne({
    where: {
      electioncode: code,
      id: { [Op.not]: currentRecordId }, // Exclude the current record
    },
  });

  return !!existingRecord;
};
export const uploadVoters = async (req, res, next) => {
  try {
    const { electionid } = req.params;
    let elect = await election.findOne({
      where: { electionid, adminid: req.user.id },
    });
    const adminid = req.user.id;

    const filePath = req.file.path;
    if (!req.file) {
      return res.status(404).send({ message: "no file uploaded" });
    }
    if (!elect) {
      return res.status(404).send({ message: "election doesnt exist" });
    } else if (elect.adminid !== req.user.id) {
      return res
        .status(403)
        .send({ message: "cant use other peoples resource" });
    } else {
      await processCSV(filePath, electionid, adminid);

      return res.status(200).send("Voters uploaded successfully");
    }
  } catch (error) {
    next(error);
  }
};

export const sendElectionCode2 = async (req, res, next) => {
  let { electionid } = req.params;
  let elect = await election.findOne({
    where: { electionid },
    attributes: ["electionname"],
  });

  try {
    const uniqueEmails = await Voter.findAll({
      attributes: [
        "email",
        [sequelize.fn("MAX", sequelize.col("electioncode")), "electioncode"],
        [sequelize.fn("MAX", sequelize.col("fullname")), "fullname"],
        [sequelize.fn("MAX", sequelize.col("id")), "id"],
      ],
      where: { codesent: false, electionid },
      group: ["email"],
    });

    for (const { email, electioncode, fullname, id } of uniqueEmails) {
      const emailSentSuccessfully = sendActivationEmail2(
        email,
        fullname,
        electioncode,
        id,
        elect?.electionname
      );

      if (emailSentSuccessfully) {
        await Voter.update(
          { codesent: true },
          { where: { email, electionid, status: true } }
        );
      } else {
        console.error(`Failed to send email to ${email}`);
      }
    }

    const totalvoters = await Voter.count({
      where: { electionid, adminid: req.user.id, status: 1 },
    });

    const totalcodesent = await Voter.count({
      where: { electionid, adminid: req.user.id, codesent: true },
    });

    res.status(200).send({ totalcodesent, totalvoters });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendElectionCode = async (req, res, next) => {
  let { electionid } = req.params;
  let elect = await election.findOne({
    where: { electionid },
    attributes: ["electionname"],
  });

  try {
    const uniqueEmails = await Voter.findAll({
      attributes: [
        "email",
        [sequelize.fn("MAX", sequelize.col("electioncode")), "electioncode"],
        [sequelize.fn("MAX", sequelize.col("fullname")), "fullname"],
        [sequelize.fn("MAX", sequelize.col("id")), "id"],
      ],
      where: { codesent: false, electionid },
      group: ["email"],
    });

    const emailDataArray = uniqueEmails.map(
      ({ email, electioncode, fullname, id }) => {
        return {
          email,
          electioncode,
          fullname,
          id,
        };
      }
    );

    const apiBaseUrl = "https://api.elasticemail.com/v2/email/send";

    const emailPromises = emailDataArray.map(
      async ({ email, electioncode, fullname, id }) => {
        const emailData = {
          apiKey:
            "93FE66982FEBDC11AC0A3E3AC38CDB930CCFF4166F02773BBC86A8D6DD96A489123155641E1C7B3AFC8BEC72C6C7190",
          to: email,
          subject: "Your Subject",
          from: "info@michofat.com",
          bodyHtml: `<p>Hello ${fullname}, your election code is: ${electioncode}</p>`,
        };

        try {
          const response = await axios.post(apiBaseUrl, emailData);
          console.log(`Email sent successfully to ${email}:`, response.data);
          await Voter.update(
            { codesent: true },
            { where: { email, electionid, status: true } }
          );
          return { success: true, email };
        } catch (error) {
          console.error(
            `Failed to send email to ${email}:`,
            error.response.data
          );
          return { success: false, email };
        }
      }
    );

    const results = await Promise.all(emailPromises);

    const totalvoters = await Voter.count({
      where: { electionid, adminid: req.user.id, status: 1 },
    });

    const totalcodesent = results.filter((result) => result.success).length;

    res.status(200).send({ totalcodesent, totalvoters });
  } catch (error) {
    console.error("Error in sendElectionCode:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const votersLogin = async (req, res, next) => {
  let { email, password } = req.body;
  let user = await Voter.findOne({ where: { email } });
  try {
    await votersloginSchema.validate(
      { email, password },
      {
        abortEarly: false,
      }
    );
    if (!user) {
      return res.status(404).send({ message: "Email doesnt exist" });
    } else if (user.deletestatus === true) {
      return res.status(404).json({
        message: "Account deactivated. Please contact the admin",
      });
    } else {
      if (password !== user?.electioncode) {
        return res.status(404).send({ message: "Login failed" });
      } else {
        return res.status(200).send(user);
      }
    }
  } catch (error) {
    next(error);
  }
};

export const getElectionVoter = async (req, res, next) => {
  let { electionid } = req.params;
  try {
    let electionexist = await election.findOne({ where: { electionid } });
    if (!electionexist) {
      return res.status(404).send({ message: "election doesnt exist" });
    } else if (electionexist.adminid !== req.user.id) {
      return res
        .status(403)
        .send({ message: "You are only permitted to view your resource" });
    } else {
      const totalvoters = await Voter.count({
        where: { electionid, adminid: req.user.id, status: 1 },
      });
      const totalcodesent = await Voter.count({
        where: { electionid, adminid: req.user.id, codesent: true },
      });
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const offset = (page - 1) * pageSize;
      const totalPages = Math.ceil(totalvoters / Number(pageSize));
      let voters = await Voter.findAll({
        where: { electionid, adminid: req.user.id, status: 1 },
        offset,
        limit: pageSize,
      });

      return res
        .status(200)
        .send({ voters, totalvoters, totalcodesent, totalPages });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteElectionVoters = async (req, res, next) => {
  let { electionid } = req.params;
  let electionexist = await election.findOne({ where: { electionid } });

  try {
    if (!electionexist) {
      return res.status(404).send({ message: "election doesnt exist" });
    } else if (electionexist.adminid !== req.user.id) {
      return res
        .status(403)
        .send({ message: "You are only permitted to view your resource" });
    } else {
      await Voter.update(
        { status: false },
        {
          where: { electionid, codesent: 0 },
        }
      );
      const totalvoters = await Voter.count({
        where: { electionid, adminid: req.user.id, status: 1 },
      });
      return res.status(200).send({ totalvoters });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteVoter = async (req, res, next) => {
  let { voterid, electionid } = req.params;
  let voter = await Voter.findOne({ where: { id: voterid } });

  try {
    if (!voter) {
      return res.status(404).send({ message: "voter doesnt exist" });
    } else if (voter.adminid !== req.user.id) {
      return res
        .status(403)
        .send({ message: "You are only permitted to delete your resource" });
    } else {
      await Voter.update(
        { status: false },
        {
          where: { id: voterid, codesent: false },
        }
      );
      const totalvoters = await Voter.count({
        where: { electionid, adminid: req.user.id, status: 1 },
      });

      return res.status(200).send({ totalvoters });
    }
  } catch (error) {
    next(error);
  }
};

export const editVoter = async (req, res, next) => {
  let { voterid } = req.params;
  let { idnumber, email, phonenumber, profile, fullname } = req.body;
  let voter = await Voter.findOne({
    where: {
      id: voterid,
    },
  });

  try {
    if (!voter) {
      return res.status(404).send({ message: "voter doesnt exist" });
    } else {
      if (req.user.id !== voter.adminid) {
        return res
          .status(404)
          .send({ message: "Cant update voter outside your organization" });
      }
      await Voter.update(
        { idnumber, email, phonenumber, profile, fullname },
        {
          where: {
            id: voterid,
          },
        }
      );
      return res.status(200).send("success");
    }
  } catch (error) {
    next(error);
  }
};

export const addVoters = async (req, res, next) => {
  let { voters } = req.body;
  let { electionid } = req.params;

  let electionss = await election.findOne({ where: { electionid } });

  try {
    if (!electionid) {
      return res.status(403).send("election doesnt exist");
    } else if (electionss.adminid !== req.user.id) {
      return res.status(403).send("forbidden to edit other resource");
    } else {
      if (electionid) {
        await Promise.all(
          voters.map(async (data, index) => {
            await voterSchema.validate(data, { abortEarly: false });
          })
        );

        const voterDataArray = voters.map((data) => ({
          idnumber: data.idnumber,
          email: data.email,
          phonenumber: data.phonenumber,
          profile: data.profile,
          fullname: data.fullname,
          adminid: req.user.id,
          electionid,
          electioncode: generate8DigitCode(),
        }));
        await Voter.bulkCreate(voterDataArray);
        return res.status(200).send("voters added successfully");
      } else {
        return res.status(404).send({ message: "unable to post " });
      }
    }
  } catch (error) {
    next(error);
  }
};

export const getVoterStat = async (req, res, next) => {
  let { electionid } = req.params;
  let elect = await election.findOne({
    where: {
      electionid,
    },
  });

  try {
    if (!elect) {
      return res.status(404).send({ message: "Election doesnt exist" });
    } else {
      if (req.user.id !== elect.adminid) {
        return res
          .status(404)
          .send({ message: "Cant view stat outside your organization" });
      }
      const totalvoters = await Voter.count({
        where: { electionid, adminid: req.user.id, status: 1 },
      });
      const totalcodesent = await Voter.count({
        where: { electionid, adminid: req.user.id, codesent: true },
      });
      return res.status(200).send({ totalvoters, totalcodesent });
    }
  } catch (error) {
    next(error);
  }
};
export const VotersLoginn = async (req, res, next) => {
  let { voterId, codeVote } = req.body;

  try {
    const user = await Voter.findOne({
      where: {
        id: voterId,
        electioncode: codeVote,
      },
    });
    if (!user) {
      return res.status(409).json({
        message: "Invalid Login details",
      });
    } else if (user.deletestatus === true) {
      return res.status(404).json({
        message: "Account deactivated. Please contact Admin",
      });
    } else {
      if (codeVote && voterId) {
        if (codeVote !== user?.electioncode) {
          return res.status(404).json({
            message: "Error",
          });
        } else {
          const token = generateTokenVoter(user);
          res.setHeader("Authorization", `Bearer ${token}`);
          return res.status(200).send({ token, electionid: user?.electionid });
        }
      }
    }
  } catch (error) {
    next(error);
  }
};
