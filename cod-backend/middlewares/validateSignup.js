// middlewares/validateSignup.js
export function validateSignup(req, res, next) {
    const { fullName, storeName, username, email, phone, password } = req.body;

    if (!fullName || !storeName || !username || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Basic validation (expand as needed)
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    next();
  }
