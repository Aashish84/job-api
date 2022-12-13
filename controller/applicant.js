const Applicant = require("../models/Applicant");
const nodemailer = require("nodemailer");
const Job = require("../models/Job");
const { default: mongoose } = require("mongoose");

const addApplicant = async (req, res, next) => {
  try {
    // applicant contain job and loggedin : user_id
    let applicant = { ...req.body };
    applicant.applied_by = req.user._id;

    // check if already applied for job
    const application_already_exist_count = await Applicant.count(applicant);
    if (application_already_exist_count) {
      return res.status(400).json({ msg: "already applied" });
    }

    // create new application
    const applicant_res = await Applicant.create(applicant);

    // after success
    // send mail to jobseeker by employer
    if (Object.keys(applicant_res).length !== 0) {
      // get job with description from job_id of req-body
      const applied_job = await Job.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(applicant_res.job),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "created_by",
            foreignField: "_id",
            as: "employer_detail",
            pipeline: [
              {
                $project: {
                  password: 0,
                },
              },
            ],
          },
        },
        { $unwind: "$employer_detail" },
      ]);

      // console.log(applied_job[0].employer_detail.email);

      // send mail
      // mail sent to mailtrap
      let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "04d99d1d3aa794",
          pass: "09ef48b414bb51",
        },
      });

      let info = await transporter.sendMail({
        from: `${applied_job[0].employer_detail.email}`,
        to: `<${req.user.email}>`,
        subject: `Vacancy Submission for ${applied_job[0].title}`, // Subject line
        text: `${req.user.name} applied for job: ${applied_job[0].title}`, // plain text body
        html: `<b>${req.user.name} applied for job: ${applied_job[0].title}</b>`, // html body
      });
    }

    res.status(200).json(applicant_res);
  } catch (error) {
    next(error);
  }
};

module.exports = { addApplicant };
