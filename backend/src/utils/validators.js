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

export const isValidProjectStatus = (status) => {
  const allowedStatuses = [
    "PLANNING",
    "ACTIVE",
    "ON_HOLD",
    "COMPLETED",
  ];

  return allowedStatuses.includes(status);
};

export const isValidPriority = (priority) => {
  const allowedPriorities = [
    "LOW",
    "MEDIUM",
    "HIGH",
    "URGENT",
  ];

  return allowedPriorities.includes(priority);
};

export const parseOptionalDate = (value) => {
  if (value === undefined) {
    return {
      provided: false,
      value: undefined,
      valid: true,
    };
  }

  if (value === null || value === "") {
    return {
      provided: true,
      value: null,
      valid: true,
    };
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      provided: true,
      value: null,
      valid: false,
    };
  }

  return {
    provided: true,
    value: date,
    valid: true,
  };
};

export const isValidTaskStatus = (status) => {
  const allowedStatuses = [
    "TODO",
    "IN_PROGRESS",
    "IN_REVIEW",
    "COMPLETED",
  ];

  return allowedStatuses.includes(status);
};

export const normalizeText = (value) => {
  return value.trim().replace(/\s+/g, " ");
};