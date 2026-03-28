const { z } = require('zod');
const prisma = require('../config/db');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } = require('../constants');

const addToCartSchema = z.object({
  body: z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive().max(10).default(1),
  }),
});

const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().positive().max(10),
  }),
  params: z.object({
    itemId: z.coerce.number().int().positive(),
  }),
});

const cartInclude = {
  items: {
    orderBy: { id: 'desc' },
    include: {
      product: {
        include: {
          category: true,
          images: {
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
            take: 1,
          },
        },
      },
    },
  },
};

const ensureCart = async (userId) => {
  const existing = await prisma.cart.findUnique({
    where: { userId },
    include: cartInclude,
  });

  if (existing) {
    return existing;
  }

  return prisma.cart.create({
    data: { userId },
    include: cartInclude,
  });
};

const formatCart = (cart) => {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );
  const originalTotal = cart.items.reduce(
    (sum, item) => sum + Number(item.product.mrp) * item.quantity,
    0,
  );
  const savings = originalTotal - subtotal;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;

  return {
    ...cart,
    summary: {
      totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      originalTotal,
      savings,
      shipping,
      total: subtotal + shipping,
    },
  };
};

const getCart = async (req, res, next) => {
  try {
    const cart = await ensureCart(req.user.id);
    res.json(new ApiResponse(200, formatCart(cart)));
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = addToCartSchema.parse({ body: req.body }).body;
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    if (product.stock < quantity) {
      throw new ApiError(400, 'Requested quantity is not available');
    }

    const cart = await ensureCart(req.user.id);
    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
      const nextQuantity = existingItem.quantity + quantity;

      if (product.stock < nextQuantity) {
        throw new ApiError(400, 'Not enough stock available for this update');
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: nextQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    const updatedCart = await ensureCart(req.user.id);
    res.json(new ApiResponse(200, formatCart(updatedCart), 'Item added to cart'));
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const {
      body: { quantity },
      params: { itemId },
    } = updateCartItemSchema.parse({
      body: req.body,
      params: req.params,
    });

    const cart = await ensureCart(req.user.id);
    const cartItem = cart.items.find((item) => item.id === itemId);

    if (!cartItem) {
      throw new ApiError(404, 'Cart item not found');
    }

    if (cartItem.product.stock < quantity) {
      throw new ApiError(400, 'Requested quantity exceeds available stock');
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    const updatedCart = await ensureCart(req.user.id);
    res.json(new ApiResponse(200, formatCart(updatedCart), 'Cart updated'));
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const itemId = Number(req.params.itemId);
    const cart = await ensureCart(req.user.id);
    const cartItem = cart.items.find((item) => item.id === itemId);

    if (!cartItem) {
      throw new ApiError(404, 'Cart item not found');
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    const updatedCart = await ensureCart(req.user.id);
    res.json(new ApiResponse(200, formatCart(updatedCart), 'Item removed from cart'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  addToCartSchema,
  updateCartItemSchema,
  ensureCart,
  formatCart,
};
