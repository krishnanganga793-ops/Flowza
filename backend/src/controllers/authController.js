import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import RefreshToken from "../models/RefreshToken.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  clearRefreshCookie,
  hashToken,
  persistRefreshToken,
  setRefreshCookie,
  signAccessToken,
  signRefreshToken
} from "../utils/tokens.js";

function authPayload(user, accessToken) {
  return { user, accessToken };
}

async function issueTokens(res, user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await persistRefreshToken(user, refreshToken);
  setRefreshCookie(res, refreshToken);
  return accessToken;
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, timezone } = req.validated.body;
  const existing = await User.findOne({ email });

  if (existing) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({ name, email, password, timezone });
  const accessToken = await issueTokens(res, user);
  res.status(201).json(authPayload(user, accessToken));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = await issueTokens(res, user);
  res.json(authPayload(user, accessToken));
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.signedCookies.refreshToken || req.cookies.refreshToken;
  if (!token) {
    const error = new Error("Refresh token required");
    error.statusCode = 401;
    throw error;
  }

  const decoded = jwt.verify(token, env.refreshSecret);
  const stored = await RefreshToken.findOne({ tokenHash: hashToken(token), userId: decoded.sub });
  if (!stored) {
    const error = new Error("Invalid refresh token");
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(decoded.sub);
  if (!user) {
    const error = new Error("User no longer exists");
    error.statusCode = 401;
    throw error;
  }

  await stored.deleteOne();
  const accessToken = await issueTokens(res, user);
  res.json(authPayload(user, accessToken));
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.signedCookies.refreshToken || req.cookies.refreshToken;
  if (token) await RefreshToken.deleteOne({ tokenHash: hashToken(token) });
  clearRefreshCookie(res);
  res.json({ message: "Logged out" });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = req.validated.body;
  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  }).select("-password");

  res.json({ user });
});
