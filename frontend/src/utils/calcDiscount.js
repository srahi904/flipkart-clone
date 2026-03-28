const calcDiscount = (price, mrp) => {
  const safePrice = Number(price || 0);
  const safeMrp = Number(mrp || 0);

  if (!safeMrp || safeMrp <= safePrice) {
    return 0;
  }

  return Math.round(((safeMrp - safePrice) / safeMrp) * 100);
};

export default calcDiscount;
