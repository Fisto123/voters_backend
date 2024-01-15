// processCSV.js
import fs from "fs";
import csv from "csv-parser";
import db, { sequelize } from "../models/index.js";
import { generate8DigitCode } from "../utils/randomcode.js";
import { Op } from "sequelize";
import { sendActivationEmail2 } from "../utils/email.config.js";
import { votersloginSchema } from "../validations/auth/login.js";
const Voter = db.evoter;

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
const processCSV = async (filePath, electionid, adminid, batchSize = 200) => {
  return new Promise((resolve, reject) => {
    let currentMaxId = 0; // Variable to keep track of the current maximum id
    const results = [];
    let currentBatch = [];

    const processBatch = async (batch) => {
      try {
        // Adjust the id field in the batch based on the current maximum id
        const adjustedBatch = batch.map((item) => {
          item.id = ++currentMaxId;
          return item;
        });

        // Save the data to the database
        await Voter.bulkCreate(adjustedBatch);
      } catch (error) {
        // Reject the promise if there's an error
        reject(error);
      }
    };

    const stream = fs
      .createReadStream(filePath)
      .pipe(csv())
      .on("data", async (data) => {
        const { firstname, lastname, email, profile, phonenumber } = data;

        currentBatch.push({
          id: null,
          electionid,
          firstname,
          lastname,
          email,
          profile,
          phonenumber,
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
    const adminid = req.user.id;

    const filePath = req.file.path;

    await processCSV(filePath, electionid, adminid);

    res.status(200).send("Voters uploaded successfully");
  } catch (error) {
    next(error);
  }
};

// export const getSingleVoter = async (req, res) => {
//   try {
//     const uniqueEmails = await Voter.findAll({
//       attributes: [
//         [sequelize.fn("DISTINCT", sequelize.col("email")), "email"],
//         "electioncode",
//         "firstname",
//         "lastname",
//       ],
//     });

//     for (const { email, electioncode, firstname, lastname } of uniqueEmails) {
//       console.log(email);
//       // sendActivationEmail2(email, firstname, lastname, "send", electioncode);
//     }

//     res.status(200).send("Activation emails sent successfully");
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// Example function to generate activation codes (replace with your actual implementation)

export const sendElectionCode = async (req, res, next) => {
  let { electionid } = req.params;
  try {
    const uniqueEmails = await Voter.findAll({
      attributes: [
        "email",
        [sequelize.fn("MAX", sequelize.col("electioncode")), "electioncode"],
        [sequelize.fn("MAX", sequelize.col("firstname")), "firstname"],
        [sequelize.fn("MAX", sequelize.col("lastname")), "lastname"],
      ],
      where: { codesent: false, electionid },
      group: ["email"],
    });

    for (const { email, electioncode, firstname, lastname } of uniqueEmails) {
      const emailSentSuccessfully = sendActivationEmail2(
        email,
        firstname,
        lastname,
        "send",
        electioncode
      );
      if (emailSentSuccessfully) {
        await Voter.update(
          { codesent: true },
          { where: { email, electionid } }
        );
      }
    }

    res.status(200).send("Activation emails sent successfully");
  } catch (error) {
    console.error(error);
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
