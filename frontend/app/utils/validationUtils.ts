
interface ValidationResult {
  isValid: boolean;
  errors: {
    email?: string;
    password?: string;
    username?: string;
  };
}

export const validateSignupForm = (
  email: string,
  password: string,
  username: string
): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    errors: {}
  };

  // Full Name validation
  if (!username.trim()) {
    result.errors.username = 'Full name is required';
    result.isValid = false;
  } else if (username.trim().length < 3) {
    result.errors.username = 'Name too short';
    result.isValid = false;
  }

  // Email validation
  if (!email.trim()) {
    result.errors.email = 'Email is required';
    result.isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))  {
    result.errors.email = 'Email is invalid';
    result.isValid = false;
    console.log('the email is ',email)
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