const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');

// @desc    Create order
// @route   POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;
  if (!orderItems || orderItems.length === 0) {
    res.status(400); throw new Error('No order items');
  }
  const order = new Order({
    user: req.user._id, orderItems, shippingAddress, paymentMethod,
    itemsPrice, shippingPrice, taxPrice, totalPrice,
  });
  const createdOrder = await order.save();
  res.status(201).json({ success: true, order: createdOrder });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  res.json({ success: true, order });
});

// @desc    Get user orders
// @route   GET /api/orders/myorders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.orderStatus = req.body.orderStatus || order.orderStatus;
  if (req.body.orderStatus === 'Delivered') {
    order.isDelivered = true; order.deliveredAt = Date.now();
  }
  const updatedOrder = await order.save();
  res.json({ success: true, order: updatedOrder });
});

// @desc    Get dashboard stats (admin)
// @route   GET /api/orders/stats
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]);
  const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
  const recentOrders = await Order.find({}).populate('user', 'name').sort({ createdAt: -1 }).limit(5);
  res.json({
    success: true,
    stats: {
      totalOrders, pendingOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
    }
  });
});

module.exports = { createOrder, getOrderById, getMyOrders, getAllOrders, updateOrderStatus, getDashboardStats };
