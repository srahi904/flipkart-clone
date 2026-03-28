const prisma = require('../config/db');
const ApiResponse = require('../utils/ApiResponse');

const getAllCategories = async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    res.json(new ApiResponse(200, categories));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCategories };
