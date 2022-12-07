const express = require("express");
require("dotenv").config();
const cors = require("cors");

// initializing mongodb
require("./db/connectDB");

// middleware
const notFound = require("./middleware/page-not-found");
const errorHandeler = require("./middleware/error-handeler");

// routes
const auth = require("./routes/auth");
const job = require("./routes/job");
const applicant = require("./routes/applicant");
const jobseeker = require("./routes/jobseeker");
const employer = require("./routes/employer");

const app = express();

app.use(express.json());
// cross-origin-resource-sharing
// to make api access to react-app
app.use(cors());

app.use("/api/v1/job_img", express.static("uploads/job_uploads"));
app.use("/api/v1/user_img", express.static("uploads/user_uploads"));

app.get("/test", (req, res) => {
  res.json({ msg: "test" });
});
// auth - login , register
app.use("/api/v1", auth);
app.use("/api/v1/jobs", job);
app.use("/api/v1/applicant", applicant);
app.use("/api/v1/jobseeker", jobseeker);
app.use("/api/v1/employer", employer);

app.use(notFound);
app.use(errorHandeler);

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log(`server is listening at port ${PORT}`);
});
