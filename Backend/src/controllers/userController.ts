import { Request, Response } from "express";
import { userDatabase, User } from "../models/User";
import { UserPreferences } from "../algorithms/compatibility";

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, about, preferences } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !preferences) {
      res.status(400).json({
        error: "Missing required fields: name, email, phone, preferences",
      });
      return;
    }

    // Validate preferences
    const requiredPreferences = [
      "cleanliness",
      "sleep_schedule",
      "noise_tolerance",
      "guests",
      "lifestyle",
      "study_work",
      "ac_preference",
      "roommate_count",
    ];

    for (const pref of requiredPreferences) {
      if (!preferences[pref]) {
        res.status(400).json({
          error: `Missing required preference: ${pref}`,
        });
        return;
      }
    }

    // Check if email already exists
    const existingUser = userDatabase.findByEmail(email);
    if (existingUser) {
      res.status(409).json({
        error: "User with this email already exists",
      });
      return;
    }

    // Create user
    const user = userDatabase.create({
      name,
      email,
      phone,
      about: about || "",
      preferences: preferences as UserPreferences,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        about: user.about,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const user = userDatabase.getById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      about: user.about,
      preferences: user.preferences,
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = userDatabase.getAll();
    const userDTOs = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      about: user.about,
      preferences: user.preferences,
    }));

    res.json({ users: userDTOs });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const { name, email, phone, about, preferences } = req.body;
    
    const updateData: Partial<User> = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (about !== undefined) updateData.about = about;
    if (preferences !== undefined) updateData.preferences = preferences as UserPreferences;

    const updatedUser = userDatabase.update(userId, updateData);

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        about: updatedUser.about,
        preferences: updatedUser.preferences,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const deleted = userDatabase.delete(userId);

    if (!deleted) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

