const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const prisma = require('../config/db');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8).max(128),
    phone: z.string().trim().min(10).max(20).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8).max(128),
  }),
});

const toSafeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  createdAt: user.createdAt,
});

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const register = async (req, res, next) => {
  try {
    const payload = registerSchema.parse({ body: req.body }).body;
    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (existingUser) {
      throw new ApiError(409, 'An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);
    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        passwordHash,
        cart: { create: {} },
      },
    });

    const token = signToken(user.id);

    res.status(201).json(
      new ApiResponse(
        201,
        {
          token,
          user: toSafeUser(user),
        },
        'Account created successfully',
      ),
    );
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const payload = loginSchema.parse({ body: req.body }).body;
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user?.passwordHash) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isValid = await bcrypt.compare(payload.password, user.passwordHash);

    if (!isValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = signToken(user.id);

    res.json(
      new ApiResponse(200, {
        token,
        user: toSafeUser(user),
      }),
    );
  } catch (error) {
    next(error);
  }
};

const getAuthUser = async (req, res) => {
  res.json(new ApiResponse(200, req.user));
};

module.exports = {
  register,
  login,
  getAuthUser,
  registerSchema,
  loginSchema,
};
