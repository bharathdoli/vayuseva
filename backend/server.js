const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const nodemailer = require("nodemailer");
const multer = require("multer");
const twilio = require('twilio');

const path = require("path");
require("dotenv").config();



const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTHTOKEN;
console.log("Account SID:", process.env.ACCOUNT_SID); // Should start with AC
console.log("Auth Token:", process.env.AUTHTOKEN);   // Should match Twilio's Auth Token

const twilioClient = twilio(accountSid, authToken);

// Twilio virtual number (replace with your actual Twilio number)
const twilioPhoneNumber = process.env.TWILIO_PHONENUMBER;
// Your mobile number
const yourPhoneNumber = process.env.YOUR_PHONENUMBER; // E.g., +1234567890


// App setup
const app = express();

app.use(helmet()); // Add security headers
app.use(bodyParser.json());

app.use(cors({
  origin: ['http://localhost:3000',
    'http://192.168.202.57:3000'
  ],
  methods:["GET","POST"],
}));


app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));




// Models
const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instaLink: { type: String, required: true },
  thumbnail: {
    data: Buffer,
    contentType: String,
  },
}, { timestamps: true }); 

const Card = mongoose.model('Card', cardSchema);

// Donation model
const donationSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Donation = mongoose.model("Donation", donationSchema);

// Create a transporter for sending emails (if needed)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail email
    pass: process.env.EMAIL_PASS,  // App password or generated password
  },
});

// Contact form route (if needed)
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Sender email
      to: process.env.MY_EMAIL, // Recipient email
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending message" });
  }
});

// Routes
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

app.post('/api/cards', upload.single('thumbnail'), async (req, res) => {
  try {
    const { title, description, instaLink } = req.body;
    const thumbnail = req.file;

    if (!thumbnail) {
      return res.status(400).json({ message: 'Thumbnail is required' });
    }

    const newCard = new Card({
      title,
      description,
      instaLink,
      thumbnail: {
        data: thumbnail.buffer,
        contentType: thumbnail.mimetype,
      },
    });

    await newCard.save();
    res.status(201).json({ message: 'Card added successfully!' });
  } catch (error) {
    console.error('Error adding card:', error.message);
    res.status(500).json({ message: error.message });
  }
});


app.get('/api/cards', async (req, res) => {
  try {
    const cards = await Card.find(); // Fetch all cards
    const updatedCards = cards.map((card) => {
      if (card.thumbnail) {
        // Convert binary data to base64 string
        const base64Thumbnail = card.thumbnail.data.toString('base64');
        return { 
          ...card.toObject(), 
          thumbnail: `data:image/jpeg;base64,${base64Thumbnail}`,
          createdAt: card.createdAt,  // Include createdAt in the response
        };
      }
      return card;
    });
    res.json(updatedCards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).send('Server Error');
  }
});


const sendDonationNotification = async (category, description, email, phoneNumber) => {
  try {
    const message = await twilioClient.messages.create({
      body: `New Donation:\nCategory: ${category}\nDescription: ${description}\nEmail: ${email}\nPhone: ${phoneNumber}`,
      from: twilioPhoneNumber, // Twilio virtual number
      to: yourPhoneNumber, // Your personal phone number
    });
    console.log("SMS sent successfully:", message.sid);
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};

// Donation submission route
app.post("/api/donations", async (req, res) => {
  const { category, description, email, phoneNumber } = req.body;

  // Validate input
  if (!category || !description || !email || !phoneNumber) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const donation = new Donation({
      category,
      description,
      email,
      phoneNumber,
    });

    await donation.save(); // Save the donation to the database

    // Send SMS notification
    await sendDonationNotification(category, description, email, phoneNumber);

    res.status(201).json({ message: "Donation submitted successfully" });
  } catch (error) {
    console.error("Error submitting donation:", error);
    res.status(500).json({ message: "Server error during donation submission" });
  }
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ["donor", "requester"], default: "donor" },
});

// Request model
const requestSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Request = mongoose.model("Request", requestSchema);

// Request submission route
const sendRequestNotification = async (category, description, contact) => {
  try {
    const message = await twilioClient.messages.create({
      body: `New Request:\nCategory: ${category}\nDescription: ${description}\nContact: ${contact}`,
      from: twilioPhoneNumber, // Twilio virtual number
      to: yourPhoneNumber, // Your personal phone number
    });
    console.log("SMS sent successfully:", message.sid);
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};

// Request submission route
app.post("/api/requests", async (req, res) => {
  const { category, description, contact } = req.body;

  // Validate input
  if (!category || !description || !contact) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const request = new Request({
      category,
      description,
      contact,
    });

    await request.save(); // Save the request to the database

    // Send SMS notification
    await sendRequestNotification(category, description, contact);

    res.status(201).json({ message: "Request submitted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error during request submission", error: error.message });
  }
});

// Get all donations
app.get("/api/donations", async (req, res) => {
  try {
    const donations = await Donation.find(); // Fetch all donations from the database
    res.status(200).json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ message: "Server error fetching donations" });
  }
});


// Get all requests
app.get("/api/requests", async (req, res) => {
  try {
    const requests = await Request.find(); // Fetch all requests from the database
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Server error fetching requests" });
  }
});


// Password hashing middleware
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
  next();
});

const User = mongoose.model("User", userSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
console.log("jwt",JWT_SECRET);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No authorization header" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

// Rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again later.",
});

// Register route
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login route
app.post("/api/auth/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
      JWT_SECRET
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Get user data route (protected)
app.get("/api/auth/user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found or token invalid" });

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(401).json({ message: "Authentication failed" });
  }
});

// Change Password Route
app.put("/api/auth/change-password", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both current and new passwords are required" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error during password change" });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
