const { AdminModel } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

/**
 * Create a new admin
 */
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, image } = req.body;

    const existingAdmin = await AdminModel.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists." });
    }

    const admin = new AdminModel({ name, email, password, image });
    await admin.save();

    res.status(201).json({ message: "Admin created successfully.", admin });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating admin.", error: error.message });
  }
};

/**
 * Admin login
 */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during login.", error: error.message });
  }
};

/**
 * Get all admins
 */
const getAllAdmins = async (req, res) => {
  try {
    const admins = await AdminModel.find();
    res.status(200).json(admins);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admins.", error: error.message });
  }
};

/**
 * Get a single admin by ID
 */
const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await AdminModel.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    res.status(200).json(admin);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admin.", error: error.message });
  }
};

/**
 * Update an admin by ID
 */
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, image } = req.body;

    const admin = await AdminModel.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (password) admin.password = password;
    if (image) admin.image = image;

    await admin.save();

    res.status(200).json({ message: "Admin updated successfully.", admin });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating admin.", error: error.message });
  }
};

/**
 * Delete an admin by ID
 */
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await AdminModel.findByIdAndDelete(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    res.status(200).json({ message: "Admin deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting admin.", error: error.message });
  }
};

module.exports = {
  createAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
