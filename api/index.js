import express from "express";
import cors from "cors";
import userRoute from "../routes/userRoute.js";
import skillRoute from "../routes/skillRoute.js";
import ProjectRoute from "../routes/ProjectRoute.js";
import PostRoute from "../routes/PostRoute.js";
import FilesRoute from "../routes/FilesRoute.js";
import ProductRoute from "../routes/ProductRoute.js";
import EducationRoute from "../routes/EducationRoute.js";
import nodemailer from "nodemailer";
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.static("public"));

app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to my API",
    success: true,
  });
});

app.post("/send-email", (req, res) => {
  const { email, to, subject, body, password } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: email,
      pass: password,
    },
    tls: {
      version: "TLSv1.2",
    },
  });

  const mailOptions = {
    from: email,
    to: to,
    subject: subject,
    html: body,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      res.status(200).json({ message: "Email sent", info });
    }
  });
});

app.use(userRoute);
app.use(skillRoute);
app.use(ProjectRoute);
app.use(PostRoute);
app.use(FilesRoute);
app.use(ProductRoute);
app.use(EducationRoute);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
