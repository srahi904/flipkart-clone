const APP_NAME = 'Flipkart Clone';
const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 48;
const DEFAULT_SORT = 'featured';
const ALLOWED_PRODUCT_SORTS = [
  'featured',
  'priceAsc',
  'priceDesc',
  'ratingDesc',
  'newest',
];
const TAX_RATE = 0.18;
const SHIPPING_COST = 49;
const FREE_SHIPPING_THRESHOLD = 500;

module.exports = {
  APP_NAME,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  DEFAULT_SORT,
  ALLOWED_PRODUCT_SORTS,
  TAX_RATE,
  SHIPPING_COST,
  FREE_SHIPPING_THRESHOLD,
};
