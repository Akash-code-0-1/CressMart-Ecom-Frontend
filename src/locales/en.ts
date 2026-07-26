export default {
  storeLocation: "Store Locations",
  trackOrder: "Track Your Order",

  features: [
    {
      title: "Cash On Delivery",
      desc: "Pay safely at your doorstep upon receiving.",
    },
    {
      title: "100% Original Products",
      desc: "100% authentic and premium products guaranteed.",
    },
    {
      title: "Best Price Assurance",
      desc: "Unbeatable prices and exciting deals every day.",
    },
    {
      title: "Fast Nationwide Delivery",
      desc: "Within 24 hours inside Dhaka and fast nationwide.",
    },
  ],

  //User Authentication 

  auth: {
    signIn: {
      title: "Sign In",
      subtitle: "Access your profile metrics",
      button: "Sign In",
      loading: "Signing In...",
      noAccount: "Don't have an account?",
      createOne: "Create One",
      forgotPassword: "Forgot Password?",
    },

    signUp: {
      title: "Create Account",
      subtitle: "Register below to get started",
      button: "Create Account",
      loading: "Creating Account...",
      haveAccount: "Already have an account?",
      signIn: "Sign In",
    },

    fields: {
      fullName: "Full Name",
      phone: "Phone Number",
      email: "Email Address",
      password: "Password",
      optional: "Optional",
    },

    placeholders: {
      fullName: "John Doe",
      phone: "017XXXXXXXX",
      email: "example@domain.com",
      password: "Minimum 6 characters",
      passwordDots: "••••••••",
    },

    errors: {
      invalidPhone: "Please provide a valid Bangladeshi phone number.",
      invalidPhoneShort: "Invalid Bangladeshi mobile number.",
      passwordTooShort: "Password must be at least 6 characters.",
      nameTooShort: "Name is too short.",
      invalidCredentials: "Invalid credentials!",
      registrationFailed: "Registration failed.",
      somethingWentWrong: "Something went wrong.",
      unexpectedError: "An unexpected error occurred.",
      tokenMissing: "Authentication token missing.",
    },
  },


};
