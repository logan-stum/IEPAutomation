// src/utils/validation.js
export function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

export function validateStudentPayload({ name, grade }) {
  const errors = {};
  if (!isNonEmptyString(name)) errors.name = 'Name is required';
  // grade is optional but if present should be string
  return errors;
}

export function validateAccommodationPayload({ name }) {
  const errors = {};
  if (!isNonEmptyString(name)) errors.name = 'Accommodation name is required';
  return errors;
}
