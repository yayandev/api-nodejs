import express from "express";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import skillRoute from "./routes/skillRoute.js";
import ProjectRoute from "./routes/ProjectRoute.js";
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to my API",
    success: true,
  });
});

app.use(userRoute);
app.use(skillRoute);
app.use(ProjectRoute);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
