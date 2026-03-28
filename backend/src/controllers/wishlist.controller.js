const { z } = require('zod');
const prisma = require('../config/db');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const addWishlistSchema = z.object({
  body: z.object({
    productId: z.number().int().positive(),
  }),
});

const wishlistInclude = {
  product: {
    include: {
      category: true,
      images: {
        orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
        take: 1,
      },
    },
  },
};

const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      orderBy: { id: 'desc' },
      include: wishlistInclude,
    });

    res.json(new ApiResponse(200, wishlist));
  } catch (error) {
    next(error);
  }
};

const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = addWishlistSchema.parse({ body: req.body }).body;
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    await prisma.wishlist.upsert({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId,
        },
      },
      update: {},
      create: {
        userId: req.user.id,
        productId,
      },
    });

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      orderBy: { id: 'desc' },
      include: wishlistInclude,
    });

    res.json(new ApiResponse(200, wishlist, 'Added to wishlist'));
  } catch (error) {
    next(error);
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId,
        },
      },
    });

    if (!existing) {
      throw new ApiError(404, 'Wishlist item not found');
    }

    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId,
        },
      },
    });

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      orderBy: { id: 'desc' },
      include: wishlistInclude,
    });

    res.json(new ApiResponse(200, wishlist, 'Removed from wishlist'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  addWishlistSchema,
};
