import User from "../models/User.js";
import bcrypt from 'bcrypt';
import axios from "axios";
import jwt from 'jsonwebtoken';

const createToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const signupUser = async (req, res) => {
  try {
    const { accountNumber, fullName, email, password } = req.body;

    if (!accountNumber || !fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (accountNumber.length !== 10) {
      return res.status(400).json({ message: 'Account number must be 10 digits' });
    }

    const existingUser = await User.findOne({
      $or: [{ accountNumber }, { email }],
    });
    if (existingUser) {
      return res.status(409).json({ message: 'Account or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      accountNumber,
      fullName,
      email,
      password: hashedPassword,
    });

    const token = createToken(newUser._id);

    res
      .cookie('accessToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
      })
      .status(201)
      .json({
        message: 'Signup successful',
        user: {
          _id: newUser._id,
          accountNumber: newUser.accountNumber,
          fullName: newUser.fullName,
          email: newUser.email,
        },
      });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const MAX_ATTEMPTS = 3;
const LOCK_TIME_MINUTES = 15;

export const loginUser = async (req, res) => {
  const { accountNumber, password, captchaToken } = req.body;

  // ✅ Verify reCAPTCHA token
  try {
    const captchaRes = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      new URLSearchParams({
        secret: "6LcbjHsrAAAAAJQjQyZ3BwnL2iwLza1bqYD19d6A", // ✅ Secret key
        response: captchaToken,
      })
    );

    if (!captchaRes.data.success) {
      return res.status(403).json({ message: "CAPTCHA verification failed" });
    }
  } catch (error) {
    console.error("CAPTCHA error:", error.message);
    return res.status(500).json({ message: "CAPTCHA server error" });
  }

  // ✅ Normal login logic
  try {
    const user = await User.findOne({ accountNumber });
    if (!user) return res.status(404).json({ message: "Account not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    const token = createToken(user._id);
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      })
      .status(200)
      .json({
        message: "Login successful",
        token,
        user: {
          _id: user._id,
          accountNumber: user.accountNumber,
          fullName: user.fullName,
        },
      });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutUser = (req, res) => {
  res
    .clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict'
    })
    .status(200)
    .json({ message: 'Logout successful' });
};


export const getUserProfile = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await User.findById(id).select("-password"); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateUserProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;

    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }


    if (fullName) user.fullName = fullName;
    if (email) user.email = email;


    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
        return res.status(409).json({ message: 'Email is already in use' });
      }
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        accountNumber: updatedUser.accountNumber,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
