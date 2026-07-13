export const isValidEmail = (email) => {
  if (typeof email !== "string") {
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email.trim());
};

export const isValidPassword = (password) => {
  return typeof password === "string" && password.length >= 8;
};

export const normalizeEmail = (email) => {
  return email.trim().toLowerCase();
};

export const normalizeName = (name) => {
  return name.trim().replace(/\s+/g, " ");
};

export const getPaginationValues = (pageValue, limitValue) => {
  const parsedPage = Number.parseInt(pageValue, 10);
  const parsedLimit = Number.parseInt(limitValue, 10);

  const page =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const limit =
    Number.isInteger(parsedLimit) && parsedLimit > 0
      ? Math.min(parsedLimit, 100)
      : 10;

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};