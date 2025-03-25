export const validateName = (name: string): boolean => {
  // Check if name contains any digits and is at least 2 characters
  return !/\d/.test(name) && name.trim().length >= 2;
};

export const getNameErrorMessage = (name: string): string | null => {
  if (!name.trim()) {
    return "Name is required";
  }
  if (name.trim().length < 2) {
    return "Name must be at least 2 characters long";
  }
  if (!validateName(name)) {
    return "Name should not contain numbers";
  }
  return null;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getEmailErrorMessage = (email: string): string | null => {
  if (!email.trim()) {
    return "Email is required";
  }
  if (!validateEmail(email)) {
    return "Please enter a valid email address";
  }
  return null;
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const getPasswordErrorMessage = (password: string): string | null => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!validatePassword(password)) {
    return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
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

export const validateRole = (role: string): boolean => {
  return ['store_owner', 'user'].includes(role);
};

export const getRoleErrorMessage = (role: string): string | null => {
  if (!role) {
    return "Role is required";
  }
  if (!validateRole(role)) {
    return "Invalid role selected";
  }
  return null;
};

// Store validation
export const validateStoreName = (name: string): boolean => {
  // Store name should be at least 3 characters and can contain letters, numbers, and basic punctuation
  return /^[a-zA-Z0-9\s\-'&]{3,}$/.test(name);
};

export const getStoreNameErrorMessage = (name: string): string | null => {
  if (!name.trim()) {
    return "Store name is required";
  }
  if (name.trim().length < 3) {
    return "Store name must be at least 3 characters long";
  }
  if (!validateStoreName(name)) {
    return "Store name can only contain letters, numbers, spaces, hyphens, apostrophes, and ampersands";
  }
  return null;
};

export const validateAddress = (address: string): boolean => {
  // Address should be at least 10 characters and contain at least one number
  return address.trim().length >= 10 && /\d/.test(address);
};

export const getAddressErrorMessage = (address: string): string | null => {
  if (!address.trim()) {
    return "Address is required";
  }
  if (!validateAddress(address)) {
    return "Please enter a valid address with street number";
  }
  return null;
};

export const validateBusinessHours = (hours: string): boolean => {
  // Basic validation for business hours format (e.g., "Mon-Fri: 9am-5pm, Sat: 10am-3pm")
  return /^[a-zA-Z\s\-:]+$/.test(hours);
};

export const getBusinessHoursErrorMessage = (hours: string): string | null => {
  if (!hours.trim()) {
    return "Business hours are required";
  }
  if (!validateBusinessHours(hours)) {
    return "Please enter business hours in a valid format (e.g., Mon-Fri: 9am-5pm, Sat: 10am-3pm)";
  }
  return null;
};

export const validateDescription = (description: string): boolean => {
  // Description should be at least 20 characters
  return description.trim().length >= 20;
};

export const getDescriptionErrorMessage = (description: string): string | null => {
  if (!description.trim()) {
    return "Description is required";
  }
  if (!validateDescription(description)) {
    return "Description must be at least 20 characters long";
  }
  return null;
};