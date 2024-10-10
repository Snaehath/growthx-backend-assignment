const express = require("express");
const router = express.Router();

const Assignment = require("../model/assignment");

router.get("/", async (req, res) => {
  const adminId = req.user.userID; // Getting the admin ID from the JWT

  // Find assignments associated with the logged-in admin
  const assignments = await Assignment.find({ admin: adminId })
    .select("-__v")
    .populate("userId", "userName")
    .populate("admin", "userName");

  // Check if there are no assignments
  if (!assignments || assignments.length === 0) {
    return res.status(204).json({ message: "No assignments found" });
  }

  // Return the assignments with user and admin names
  return res.status(200).json({
    assignments: assignments.map((assignment) => ({
      _id: assignment._id,
      task: assignment.task,
      userId: assignment.userId.userName,
      admin: assignment.admin.userName,
    })),
  });
});

router.put("/:id/accept", async (req, res) => {
  // Validate if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid assignment ID." });
  }

  const assignment = await Assignment.findByIdAndUpdate(
    req.params.id,
    {
      status: "Accepted",
    },
    { new: true }
  )
    .select("-__v")
    .populate("userId", "userName")
    .populate("admin", "userName");

  // Check if the assignment was found
  if (!assignment) {
    return res
      .status(404)
      .json({ message: "The assignment with given ID was not found." });
  }
  // Return the updated assignment details
  return res.status(200).json({
    _id: assignment._id,
    task: assignment.task,
    status: assignment.status,
    userId: assignment.userId.userName,
    admin: assignment.admin.userName,
  });
});

router.put("/:id/reject", async (req, res) => {
  // Validate if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid assignment ID." });
  }

  const assignment = await Assignment.findByIdAndUpdate(
    req.params.id,
    {
      status: "Rejected",
    },
    { new: true }
  )
    .select("-__v")
    .populate("userId", "userName")
    .populate("admin", "userName");

  // Check if the assignment was found
  if (!assignment) {
    return res
      .status(404)
      .json({ message: "The assignment with given ID was not found." });
  }
  // Return the updated assignment details
  return res.status(200).json({
    _id: assignment._id,
    task: assignment.task,
    status: assignment.status,
    userId: assignment.userId.userName,
    admin: assignment.admin.userName,
  });
});
module.exports = router;
