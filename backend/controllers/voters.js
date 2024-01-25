// processCSV.js
import fs from "fs";
import csv from "csv-parser";
import db, { sequelize } from "../models/index.js";
import { generate8DigitCode } from "../utils/randomcode.js";
import { Op } from "sequelize";
import { votersloginSchema } from "../validations/auth/login.js";
import { voterSchema } from "../validations/voters/voter.js";
import { generateToken, generateTokenVoter } from "../utils/token.js";
import axios from "axios";
const Voter = db.evoter;
const election = db.election;
import ElasticEmail from "@elasticemail/elasticemail-client-ts-axios";
import crypto from "crypto";

const { Configuration, EmailsApi } = ElasticEmail;
const URL = "http://localhost:5173/vt";

const config = new Configuration({
  apiKey:
    "62A28FFDFA4CF35A3E93FAEA101ED265A1E3381E1CAE6286DD18B6D882DA579F62641017BF792DA51ABF270A70A20AC1",
});

const emailsApi = new EmailsApi(config);
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

export const sendElectionCode = async (req, res) => {
  try {
    const { electionid } = req.params;
    const elect = await election.findOne({
      where: { electionid },
      attributes: ["electionname"],
    });

    const uniqueEmails = await Voter.findAll({
      attributes: [
        "email",
        [sequelize.fn("MAX", sequelize.col("electioncode")), "electioncode"],
        [sequelize.fn("MAX", sequelize.col("fullname")), "fullname"],
        [sequelize.fn("MAX", sequelize.col("id")), "id"],
      ],
      where: { codesent: false, electionid },
      limit: 1000,
      group: ["email"],
    });

    for (const { email, electioncode, fullname, id } of uniqueEmails) {
      console.log(email);
      const emailSentSuccessfully = sendActivationEmail2(
        email,
        fullname,
        electioncode,
        id,
        elect?.electionname
      );
      console.log("email", emailSentSuccessfully);

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
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error processing emails." });
  }
};

export const sendActivationEmail2 = async (
  email,
  fullname,
  electioncode,
  id,
  electionName
) => {
  try {
    let firstlink = electioncode + id;
    const hash = crypto.createHash("md5");
    hash.update(electioncode);
    const secondlink = hash.digest("hex");

    const emailMessageData = {
      Recipients: [
        {
          Email: email,
          Fields: {
            name: fullname,
          },
        },
      ],
      Content: {
        Body: [
          {
            ContentType: "HTML",
            Charset: "utf-8",
            Content: `
              <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
              <h2>${electionName} </h2>
                <h2 style="color: #4CAF50;">Welcome to the eVoting Platform!</h2>
                <p style="font-size: 16px;">Dear ${fullname},</p>
               
                <p style="font-size: 18px; background-color: #4CAF50; padding: 10px; color: #fff;">
          <a href=${`${URL}/${firstlink}/${secondlink}`} style="color: #fff; text-decoration: none; cursor:'pointer">Click here to vote</a>
                </p>
                <p style="font-size: 16px;">If you have any questions or need assistance, feel free to contact us.</p>
                <p style="font-size: 16px;">Best regards,</p>
                <p style="font-size: 16px; font-weight: bold; color: #4CAF50;">The eVoting Team</p>
              </div>
            `,
          },
          {
            ContentType: "PlainText",
            Charset: "utf-8",
            Content: `Hi ${fullname}!`,
          },
        ],
        From: "no-reply@hubtoll.com",
        Subject: "Your email link",
      },
    };

    const response = await emailsApi.emailsPost(emailMessageData);

    console.log("API called successfully.");
    console.log(response.data);

    return true;
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
    return false;
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
        attributes: [
          "id",
          "codesent",
          "fullname",
          "email",
          "idnumber",
          "profile",
        ],
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
