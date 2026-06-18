const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// @desc    Register user
// @route   POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400); throw new Error('Please fill all fields');
  }
  const userExists = await User.findOne({ email });
  if (userExists) { res.status(400); throw new Error('User already exists'); }

  const user = await User.create({ name, email, password });
  res.status(201).json({
    success: true,
    _id: user._id, name: user.name, email: user.email,
    role: user.role, token: generateToken(user._id),
  });
});

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      _id: user._id, name: user.name, email: user.email,
      role: user.role, avatar: user.avatar, token: generateToken(user._id),
    });
  } else {
    res.status(401); throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(404); throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    if (req.body.password) user.password = req.body.password;
    const updatedUser = await user.save();
    res.json({
      success: true,
      _id: updatedUser._id, name: updatedUser.name,
      email: updatedUser.email, role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404); throw new Error('User not found');
  }
});

// @desc    Add to wishlist
// @route   POST /api/auth/wishlist/:id
const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.id;
  const index = user.wishlist.indexOf(productId);
  if (index === -1) {
    user.wishlist.push(productId);
  } else {
    user.wishlist.splice(index, 1);
  }
  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
});

// @desc    Get wishlist
// @route   GET /api/auth/wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json({ success: true, wishlist: user.wishlist });
});

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, toggleWishlist, getWishlist };
