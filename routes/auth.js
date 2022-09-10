const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPassword,
      profilePicture: req.body.profilePicture,
    });
    console.log(req.body.profilePicture);

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    User.findOne({ username: req.body.username }, (error, isUser) => {
      if (error) {
        res.status(500).json(error);
      } else if (isUser) {
        res.status(400).json("username or email already taken!");
      } else {
        res.status(503).json("sorry! try again later.");
      }
    });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(404).json("user not found!");

    if (user) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      !validPassword && res.status(400).json("wrong password!");
    }

    user && res.status(200).json(user);
  } catch (err) {
    //res.status(500).json(err);
  }
});

module.exports = router;
