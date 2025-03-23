export const validateName = (name: string): boolean => {
  // Check if name contains any digits
  return !/\d/.test(name);
};

export const getNameErrorMessage = (name: string): string | null => {
  if (!name.trim()) {
    return "Name is required";
  }
  if (!validateName(name)) {
    return "Name should not contain numbers";
  }
  return null;
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Remove any non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  // Check if it's exactly 10 digits
  return digitsOnly.length === 10;
};

export const getPhoneErrorMessage = (phone: string): string | null => {
  if (!phone.trim()) {
    return null; // Phone can be optional
  }
  if (!validatePhoneNumber(phone)) {
    return "Phone number must be exactly 10 digits";
  }
  return null;
};