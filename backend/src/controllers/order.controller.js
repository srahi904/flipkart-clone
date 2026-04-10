const { z } = require('zod');
const prisma = require('../config/db');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { sendOrderConfirmationEmail } = require('../services/mail.service');
const { FREE_SHIPPING_THRESHOLD, SHIPPING_COST, TAX_RATE } = require('../constants');
const { ensureCart, formatCart } = require('./cart.controller');

const addressSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(10).max(20),
  line1: z.string().trim().min(5).max(120),
  line2: z.string().trim().max(120).optional().or(z.literal('')),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  pincode: z.string().trim().regex(/^\d{6}$/, 'Pincode must be a 6 digit number'),
  isDefault: z.boolean().optional().default(true),
});

const placeOrderSchema = z.object({
  body: z.object({
    address: addressSchema,
    paymentMethod: z.string().optional().default('cod'),
    razorpay_payment_id: z.string().optional(),
    razorpay_order_id: z.string().optional(),
    razorpay_signature: z.string().optional(),
  }),
});

const orderInclude = {
  address: true,
  items: {
    include: {
      product: {
        include: {
          images: {
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
            take: 1,
          },
          category: true,
        },
      },
    },
  },
};

const getTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = Number((subtotal + tax + shippingCost).toFixed(2));

  return { subtotal, tax, shippingCost, total };
};

const placeOrder = async (req, res, next) => {
  try {
    const {
      body: { address, paymentMethod, razorpay_payment_id, razorpay_order_id, razorpay_signature },
    } = placeOrderSchema.parse({ body: req.body });

    const cart = await ensureCart(req.user.id);
    const normalizedCart = formatCart(cart);

    if (!normalizedCart.items.length) {
      throw new ApiError(400, 'Your cart is empty');
    }

    normalizedCart.items.forEach((item) => {
      if (item.product.stock < item.quantity) {
        throw new ApiError(
          400,
          `${item.product.name} only has ${item.product.stock} unit(s) in stock`,
        );
      }
    });

    const totals = getTotals(normalizedCart.items);

    const isRazorpayEnabled = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
    if (isRazorpayEnabled && paymentMethod !== 'cod') {
      if (!razorpay_signature || !razorpay_payment_id || !razorpay_order_id) {
        throw new ApiError(400, 'Payment verification failed: Missing Razorpay details');
      }
      const crypto = require('crypto');
      const sign = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest('hex');

      if (razorpay_signature !== expectedSign) {
        throw new ApiError(400, 'Payment verification failed: Invalid signature');
      }
    }

    const order = await prisma.$transaction(async (tx) => {
      const savedAddress = await tx.address.create({
        data: {
          userId: req.user.id,
          ...address,
        },
      });

      const createdOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          addressId: savedAddress.id,
          subtotal: totals.subtotal,
          tax: totals.tax,
          shippingCost: totals.shippingCost,
          total: totals.total,
          status: 'CONFIRMED',
          items: {
            create: normalizedCart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: orderInclude,
      });

      await Promise.all(
        normalizedCart.items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          }),
        ),
      );

      await tx.cartItem.deleteMany({
        where: { cartId: normalizedCart.id },
      });

      return createdOrder;
    });

    sendOrderConfirmationEmail({ order, user: req.user }).catch(() => null);

    res
      .status(201)
      .json(new ApiResponse(201, order, 'Order placed successfully'));
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.user.id,
      },
      include: orderInclude,
    });

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    res.json(new ApiResponse(200, order));
  } catch (error) {
    next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { placedAt: 'desc' },
      include: orderInclude,
    });

    res.json(new ApiResponse(200, orders));
  } catch (error) {
    next(error);
  }
};

const initRazorpay = async (req, res, next) => {
  try {
    const isRazorpayEnabled = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
    if (!isRazorpayEnabled) {
      return res.json(new ApiResponse(200, { isRazorpayEnabled: false }));
    }

    const cart = await ensureCart(req.user.id);
    const normalizedCart = formatCart(cart);

    if (!normalizedCart.items.length) {
      throw new ApiError(400, 'Your cart is empty');
    }

    normalizedCart.items.forEach((item) => {
      if (item.product.stock < item.quantity) {
        throw new ApiError(
          400,
          `${item.product.name} only has ${item.product.stock} unit(s) in stock`,
        );
      }
    });

    const totals = getTotals(normalizedCart.items);

    const Razorpay = require('razorpay');
    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(totals.total * 100),
      currency: 'INR',
      receipt: `receipt_order_${req.user.id}_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.json(
      new ApiResponse(200, {
        isRazorpayEnabled: true,
        key: process.env.RAZORPAY_KEY_ID,
        order,
      })
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeOrder,
  getOrderById,
  getUserOrders,
  initRazorpay,
  placeOrderSchema,
};
