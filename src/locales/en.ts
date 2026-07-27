export default {
  featuredCategory: "Featured Category",
  brands: "Brands",

  ////////////////////////
  // Top Header
  ///////////////////////

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

  ////////////////////////
  //User Authentication
  ///////////////////////

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

  ////////////////////////
  //common fixed contents
  ///////////////////////
  common: {
    viewMore: "View More",
  },

  ////////////////////////
  //Footer
  ///////////////////////
  footer: {
    company: "Company",
    account: "Account",
    corporate: "Corporate",
    getInTouch: "Get In Touch",

    address: "Address",
    callUs: "Call Us",
    email: "Email",
    hours: "Hours",
    officeHours: "10:00-18:00, Sat-Thu",

    developedBy: "Developed by",
    copyright: "Copyright",
    allRightsReserved: "All rights reserved.",

    companyLinks: [
      "About Us",
      "Shipping & Delivery",
      "Return & Exchange",
      "Privacy",
      "Terms & Conditions",
      "FAQs",
    ],

    accountLinks: [
      "Sign In",
      "View Cart",
      "My Wishlist",
      "Track My Order",
      "Help Ticket",
      "Customer Testimonials",
    ],

    corporateLinks: [
      "Become a Vendor",
      "Affiliate Program",
      "Our Blog",
      "Career",
      "Display Center",
      "Our Suppliers",
    ],
  },

  ////////////////////////
  //legal information about company pages
  ///////////////////////

  legal: {
    aboutUs: "About Us",
    privacyPolicy: "Privacy Policy",
    termsAndConditions: "Terms & Conditions",
    returnExchange: "Return & Exchange",
    home: "Home",
  },

  ////////////////////////
  //Profile
  ///////////////////////
  profileSidebar: {
    profileDetails: "Profile Details",
    orders: "Orders",
    wishList: "Wish List",
    userAccount: "User Account",
    noPhoneInfo: "No Phone Info",
    updateProfilePicture: "Update Profile Picture",
    logout: "Logout",
  },

  profileDetails: {
    title: "Profile Details",
    subtitle: "Update your personal information and contact details",

    loading: "Assembling profile components...",

    avatarTitle: "Profile Avatar Picture",
    avatarSubtitle: "Supports JPEG, PNG, or WEBP up to 2MB.",

    name: "Name",
    phone: "Phone",
    email: "Email",

    primaryAddress: "Primary Address",
    newAddress: "New Address",

    phonePlaceholder: "No phone record registered",
    addressPlaceholder: "Plot No. 23, Sector 7, Uttara Dhaka...",
    newAddressPlaceholder: "Enter new physical address location details...",

    saveChanges: "Save Changes",
    addNew: "Add New",
    select: "Select",

    address: "Address",

    validation: {
      blankName: "Name field cannot be left blank.",
      shortName: "Name must be at least 2 characters long.",
      invalidEmail: "Please enter a valid email address format.",
      imageSize: "Image file size must be under 2MB.",
    },

    success: {
      profileUpdated: "Profile modifications synchronized successfully!",
      avatarUpdated: "Profile image changed successfully!",
      addressAdded: "New address record appended.",
    },

    error: {
      saveFailed: "Could not save adjustments.",
      uploadFailed: "Failed to upload image.",
      addressFailed: "Could not append address.",
    },
  },

  ////////////////////////
  //Promotion
  ///////////////////////

  promotion: {
    loading: "Loading...",
    minOff: "Up to",
    off: "% OFF",
    shopNow: "Shop Now",
  },

  ////////////////////////
  // Navbar
  ///////////////////////

  search: {
    allCategories: "All Categories",
    searchPlaceholder: "Search products...",
    searching: "Searching...",
    hotDeals: "HOT DEALS",
  },

  ////////////////////////
  // Flash Sale
  ///////////////////////

  flashSale: {
    goToFlashSale: "Go to Flash Sale Page",
  },

  ////////////////////////
  // Testimonials
  ///////////////////////
  testimonials: {
    title: "Customer Testimonials",
    facebookReviews: "Facebook Reviews",
    youtubeReviews: "YouTube Reviews",
    customerAvatar: "Customer avatar",
    videoThumbnail: "Testimonial video thumbnail",
  },

  ////////////////////////
  // Blog
  ///////////////////////
  blog: {
    title: "Our Blogs",
    readMore: "Read More",
  },

  ////////////////////////
  // Product Details page
  ///////////////////////
  product: {
    sku: "SKU",
    review: "Review",
    reviews: "Reviews",
    sold: "Sold",
    viewed: "Viewed",
    inStock: "In Stock",
    outOfStock: "Out of Stock",

    addToCart: "Add to Cart",
    orderNow: "Order Now",

    off: "OFF",
    bdt: "BDT",

    warrantyPrefix: "*",
  },
};
