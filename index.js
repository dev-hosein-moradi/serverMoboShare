const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const router = express.Router();
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

//middleware
app.use(express.json());
// const options = {
//   credentials: true,
//   origin: ["https://xxxx-private.xxxx.se"],
// };

app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan("common"));

const uri = process.env.MONGO_URL;
const port = process.env.PORT || 4000;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("mongoDB database connetction established successfully.");
  }
});
 app.use("/images", express.static(path.join(__dirname, "public/images")));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.body.name);
//   },
// });

// const upload = multer({ storage: storage });
// app.post("/api/upload", upload.single("file"), (req, res) => {
//   try {
//     return res.status(200).json("File uploded successfully");
//   } catch (error) {
//     console.error(error);
//   }
// });

app.get("/", (req, res) => {
  res.send("API is running..");
});

// routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
/*  */

const server = app.listen(
  port,
  console.log(`Server running on port ${port}..`)
);
