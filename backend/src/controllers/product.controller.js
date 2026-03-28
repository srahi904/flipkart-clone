const { z } = require('zod');
const prisma = require('../config/db');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { getPaginationMeta } = require('../utils/pagination');
const {
  ALLOWED_PRODUCT_SORTS,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT,
  MAX_PAGE_SIZE,
} = require('../constants');

const productQuerySchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    categoryId: z.coerce.number().int().positive().optional(),
    category: z.string().trim().optional(), // category name lookup
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
    sort: z.enum(ALLOWED_PRODUCT_SORTS).default(DEFAULT_SORT),
    featured: z.union([z.literal('true'), z.literal('false')]).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
  }),
});

const getOrderBy = (sort) => {
  switch (sort) {
    case 'priceAsc':
      return [{ price: 'asc' }];
    case 'priceDesc':
      return [{ price: 'desc' }];
    case 'ratingDesc':
      return [{ rating: 'desc' }];
    case 'newest':
      return [{ createdAt: 'desc' }];
    default:
      return [{ isFeatured: 'desc' }, { rating: 'desc' }, { createdAt: 'desc' }];
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const { search, categoryId, category, page, limit, sort, featured, minPrice, maxPrice } =
      productQuerySchema.parse({ query: req.query }).query;

    // Resolve categoryId from category name if categoryId isn't provided
    let resolvedCategoryId = categoryId;
    if (!resolvedCategoryId && category) {
      const cat = await prisma.category.findFirst({
        where: { name: { equals: category, mode: 'insensitive' } },
      });
      if (cat) {
        resolvedCategoryId = cat.id;
      }
    }

    const where = {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { brand: { contains: search, mode: 'insensitive' } },
              { category: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
      ...(resolvedCategoryId ? { categoryId: resolvedCategoryId } : {}),
      ...(featured ? { isFeatured: featured === 'true' } : {}),
      ...((minPrice || maxPrice)
        ? {
            price: {
              ...(minPrice ? { gte: minPrice } : {}),
              ...(maxPrice ? { lte: maxPrice } : {}),
            },
          }
        : {}),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: getOrderBy(sort),
        include: {
          category: true,
          images: {
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
            take: 2,
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json(
      new ApiResponse(200, {
        products,
        pagination: getPaginationMeta({ page, limit, total }),
      }),
    );
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new ApiError(400, 'Invalid product id');
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
        specs: { orderBy: { specKey: 'asc' } },
      },
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    res.json(new ApiResponse(200, product));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  productQuerySchema,
};
