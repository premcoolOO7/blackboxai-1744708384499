const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const saltRounds = 12;

// In-memory user store for demo purposes
const users = {};

app.use(bodyParser.json());

// Register endpoint - hashes password and stores user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
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

// Login endpoint - verifies password
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
  console.log(`Password tool server running at http://localhost:${port}`);
});
