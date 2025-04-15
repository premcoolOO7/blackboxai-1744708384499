const express = require('express');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const sanitizeHtml = require('sanitize-html');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 4000;
const saltRounds = 12;

// Middleware for security headers
app.use(helmet());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(bodyParser.json());

// Input sanitization middleware
function sanitizeInput(req, res, next) {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeHtml(req.body[key]);
      }
    }
  }
  next();
}
app.use(sanitizeInput);

// In-memory user store for demo
const users = {};

// Register endpoint with password hashing
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  if (users[username]) {
    return res.status(400).json({ error: 'User already exists' });
  }
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    users[username] = { passwordHash: hash };
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error hashing password' });
  }
});

// Login endpoint with password verification
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }
  try {
    const match = await bcrypt.compare(password, user.passwordHash);
    if (match) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(400).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error verifying password' });
  }
});

app.listen(port, () => {
  console.log(`Security toolkit backend running at http://localhost:${port}`);
});
