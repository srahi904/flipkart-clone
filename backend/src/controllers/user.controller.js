const prisma = require('../config/db');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  createdAt: true,
  addresses: {
    orderBy: [{ isDefault: 'desc' }, { id: 'desc' }],
  },
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: userSelect,
    });

    res.json(new ApiResponse(200, user));
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    if (req.user.id !== userId) {
      throw new ApiError(403, 'You can only access your own profile');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.json(new ApiResponse(200, user));
  } catch (error) {
    next(error);
  }
};

module.exports = { getCurrentUser, getUserById };
