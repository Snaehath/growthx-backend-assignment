const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// custom modules
const User = require("../model/user");
const Assignment = require("../model/assignment");

router.post("/register", async (req, res) => {
  // Check if a user with the same userName or email already exists
  let existingUser = await User.findOne({
    $or: [{ userName: req.body.userName }, { email: req.body.email }],
  });

  if (existingUser) {
    return res.status(400).json({
      message: "User with the same username or email already exists",
    });
  }

  // If no user exists, proceed with user creation
  let user = new User({
    userName: req.body.userName,
    isAdmin: req.body.isAdmin,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
  });

  // Save the new user to the database
  user = await user.save();

  if (!user) {
    return res.status(400).json("The User cannot be created");
  }

  // Return success response with user data
  return res.status(201).json({
    userId: user._id,
    isAdmin: user.isAdmin,
    userName: user.userName,
    email: user.email,
  });
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const secret = process.env.SECRET;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Find user by email
  const user = await User.findOne({ email });

  // If user is not found
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Compare provided password with stored password hash
  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid password" });
  }

  // Generate JWT token if authentication is successful
  const token = jwt.sign(
    {
      userID: user._id,
      isAdmin: user.isAdmin,
    },
    secret,
    { expiresIn: "1d" } // Token valid for 1 day
  );

  // Respond with user email and JWT token
  return res.status(200).json({ email: user.email, token });
});

router.get("/admins", async (req, res, next) => {
  // Find all users who have isAdmin set to true
  const admins = await User.find({ isAdmin: true });

  // If no admins are found, return a 404 with a message
  if (!admins || admins.length === 0) {
    return res.status(404).json({ message: "No admins found" });
  }

  // Return an array of all admins with their userId and userName
  const adminList = admins.map((admin) => ({
    userId: admin._id,
    userName: admin.userName,
  }));

  // Send the list of admins with a 200 status
  return res.status(200).json(adminList);
});

router.post("/upload", async (req, res, next) => {
  const userId = req.user.userID; // Getting the userID from the JWT

  // Validate required fields
  if (!req.body.task || !req.body.admin) {
    return res
      .status(400)
      .json({ message: "Both task and admin are required." });
  }

  // Create a new assignment object
  const assignment = new Assignment({
    userId: userId,
    task: req.body.task,
    admin: req.body.admin,
  });

  // Save the assignment to the database
  const savedAssignment = await assignment.save();

  if (!savedAssignment) {
    throw new Error("The Assignment could not be created"); // Passes error to errorHandler
  }

  // Return success response
  return res.status(201).json({ assignmentId: savedAssignment._id });
});

module.exports = router;
