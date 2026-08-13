const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const users = [
  {
    id: 1,
    username: "admin",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin"
  },
  {
    id: 2,
    username: "user",
    password: bcrypt.hashSync("user123", 10),
    role: "user"
  }
];

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = users.find(
      (user) => user.username === username
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    );

    res.json({
      success: true,
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = {
  login
};