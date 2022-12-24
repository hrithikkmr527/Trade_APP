require("dotenv").config();
require("./config/database").connect();
const bcrypt = require("bcryptjs");
const User = require("./model/user");
const express = require("express");
const jwt = require("jsonwebtoken");
const user = require("./model/user");
const app = express();
const auth = require("./middleware/auth");

app.use(express.json());

app.post("/register", async (req, res) => {
  //register logic
  try {
    //get user input
    const { firstName, lastName, email, password } = req.body;
    console.log(
      req.body.firstName +
        "||" +
        req.body.lastName +
        "||" +
        req.body.email +
        "||" +
        req.body.password
    );
    //validate user input
    if (!(email && password && firstName && lastName)) {
      res.status(400).send("All input is required");
    }
    //check if user already exists
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exists!");
    }
    //encrypt user password
    //const encryptedPassword = await bcrypt.hash(password, 10);
    //create user in our database
    const user = await User.create({
      first_name: firstName,
      last_name: lastName,
      email: email.toLowerCase(),
      password: password,
    });
    //create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "5h",
      }
    );
    //save user token
    user.token = token;
    //return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  //login logic
  try {
    const { email, password } = req.body;

    //validate user input
    if (!(email && password)) {
      res.status(400).send("All input required");
    }

    //validate if user exists in our database
    const user = await User.findOne({ email });
    console.log(email + "||" + password + "||" + user.password);
    if (user && (await password) == user.password) {
      //create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "5h",
        }
      );
      //save user token
      user.token = token;
      return res.status(200).json(user);
    }

    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome To Trading APP");
});

module.exports = app;
