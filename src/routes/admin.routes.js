const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares");
const {
  updateAdmin,
  getAllAdmins,
  getAdminById,
  deleteAdmin,
  createAdmin,
  loginAdmin,
} = require("../controllers/admin.controller");

// Public Routes
router.post("/register", createAdmin);
router.post("/login", loginAdmin);

// Protected Routes
router.get("/", verifyToken, getAllAdmins);
router.get("/:id", verifyToken, getAdminById);
router.put("/:id", verifyToken, updateAdmin);
router.delete("/:id", verifyToken, deleteAdmin);

module.exports = router;
