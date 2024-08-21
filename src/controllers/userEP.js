import User from "../models/userEP.js";
import bcryptjs from "bcrypt";
import { generarJWT } from "../middleware/validateJWT.js";

const userController = {
  // Create a new user------------------------------------------------------------------------
  createUser: async (req, res) => {
    const { email, password, name } = req.body;

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const salt = bcryptjs.genSaltSync();
      const encryptedPassword = bcryptjs.hashSync(password, salt);

      const newUser = new User({
        email,
        password: encryptedPassword,
        name,
      });

      const result = await newUser.save();
      res.status(201).json(result);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Error creating user" });
    }
  },

  // Login------------------------------------------------------------------------------------
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (
        !user ||
        user.estado === 0 ||
        !bcryptjs.compareSync(password, user.password)
      ) {
        return res
          .status(401)
          .json({ msg: "User / Password are incorrect" });
      }

      const token = await generarJWT(user._id);
      res.json({ user, token });
    } catch (error) {
      res.status(500).json({ msg: "Please contact the WebMaster" });
    }
  },

  // List all users--------------------------------------------------------------------------------------
  listUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Error listing users" });
    }
  },

  // Edit a user by their ID-------------------------------------------------------------------------------------
  editUser: async (req, res) => {
    const { id } = req.params;
    const { email, name } = req.body;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { email, name },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Error editing user" });
    }
  },

  // Change a user's password by their ID---------------------------------------------------------------------------
  changePassword: async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const salt = bcryptjs.genSaltSync();
      user.password = bcryptjs.hashSync(password, salt);

      await user.save();
      res.json({ msg: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error changing password" });
    }
  },

  // Delete a user by their ID----------------------------------------------------------------------
  deleteUser: async (req, res) => {
    const { id } = req.params;

    try {
      const result = await User.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ msg: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting user" });
    }
  },

  // Activate or deactivate a user by their ID-----------------------------------------------------------------
  toggleUserStatus: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.estado = user.estado === 1 ? 0 : 1;
      await user.save();

      const message =
        user.estado === 1 ? "User activated" : "User deactivated";
      res.json({ msg: message + " successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error toggling user status" });
    }
  },
};

export default userController;
