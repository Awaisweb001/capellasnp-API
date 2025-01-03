const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    image: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["SuperAdmin"],
      default: "SuperAdmin",
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password during login
adminSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
