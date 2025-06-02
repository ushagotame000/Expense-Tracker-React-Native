
interface ValidationResult {
  isValid: boolean;
  errors: {
    email?: string;
    password?: string;
    fullName?: string;
  };
}

export const validateSignupForm = (
  email: string,
  password: string,
  fullName: string
): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    errors: {}
  };

  // Full Name validation
  if (!fullName.trim()) {
    result.errors.fullName = 'Full name is required';
    result.isValid = false;
  } else if (fullName.trim().length < 3) {
    result.errors.fullName = 'Name too short';
    result.isValid = false;
  }

  // Email validation
  if (!email.trim()) {
    result.errors.email = 'Email is required';
    result.isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    result.errors.email = 'Email is invalid';
    result.isValid = false;
  }

  // Password validation
  if (!password) {
    result.errors.password = 'Password is required';
    result.isValid = false;
  } else if (password.length < 6) {
    result.errors.password = 'Password must be at least 6 characters';
    result.isValid = false;
  }

  return result;
};