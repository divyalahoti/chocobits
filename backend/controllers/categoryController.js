const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true });
  res.json({ success: true, categories });
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const existing = await Category.findOne({ slug });
  if (existing) { res.status(400); throw new Error('Category already exists'); }
  const category = await Category.create({ name, slug, description, image });
  res.status(201).json({ success: true, category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) { res.status(404); throw new Error('Category not found'); }
  res.json({ success: true, category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) { res.status(404); throw new Error('Category not found'); }
  await category.deleteOne();
  res.json({ success: true, message: 'Category removed' });
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
