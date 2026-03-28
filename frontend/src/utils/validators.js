export const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

export const isValidIndianPincode = (value) => /^\d{6}$/.test(String(value || '').trim());

export const isStrongPassword = (value) =>
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(String(value || ''));

const validators = {
  isValidEmail,
  isValidIndianPincode,
  isStrongPassword,
};

export default validators;
