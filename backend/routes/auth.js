const express = require("express");
const User = require("../models/User"); // For creating a new user
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "Pawanisagoodboy";
const fetchUser = require("../middleware/fetchUser");

// TODO: Create a user using: POST "/api/auth/createuser". Doesn't require auth. Called an 'End point'
router.post(
  "/createuser", // 'Endpoint path checked after api/auth/?
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    var success = false;
    // ! If there are errors return bad request and the errors
    // const user = User(req.body);
    // user.save() // Data is sent to Mongo for storage

    const errors = validationResult(req); // ? Checks for erros using the rules give above as an array
    if (!errors.isEmpty()) {
      success = false;
      return res.status(400).json({ success: success, errors: errors.array() });
    }

    // ! Check whether the user with the same email exits already if the given data do not contain any error
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success = false
        return res
          .status(400)
          .json({ success: success, error: "Sorry! User with this email already exists" });
      }

      // ? Create a user only if the given email is unique
      // ? Create a hash for password with adding salt
      const salt = await bcrypt.genSalt(10); // Must wait as it returns a promise
      const securedPassword = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        // Creates user with data in the request
        name: req.body.name,
        email: req.body.email,
        password: securedPassword,
      });
      // ? Following code returns a jwt token used as a session key by signing with secret message
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      // res.json(user);
      success = true
      res.json({ success, authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error..");
    }
  }
);

// TODO: Authenticate a user using: POST "/api/auth/login". Doesn't require auth. Called an 'End point'
router.post(
  "/login", // 'Endpoint path checked after api/auth/?
  [
    body("email").isEmail(), 
    body("password").exists()
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    try {
      let user = await User.findOne({email}); // Must await as it is reading from database
      if(!user){
        success = false;
        return res.status(400).json({success: success, error: "Invalid credentials.. Not a user"});
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare){
        success = false;
        return res.status(400).json({success: success, error: "Invalid credentials.."});
      }

      const data = {
        user: {
          id: user.id
        }
      }

      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });

    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error..");
    }
  }
);

// TODO: Get logged-in user details using: POST "/api/auth/getuser". Doesn't require auth. Called an 'End point'.. Login is required
router.post(
  "/getuser", // 'Endpoint path checked after api/auth/?
  fetchUser,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error..");
    }
  }
)
module.exports = router;
