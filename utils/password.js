const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken')



const hashPassword = async (plainPassword) => {
    const saltRounds = 10;
    const hash = await bcrypt.hash(plainPassword, saltRounds);
    return hash;
};
const comparePassword = async (plainPassword, hashedPassword) => {
    try {
      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      return isMatch;
    } catch (err) {
      console.error('Error comparing passwords:', err);
      return false;
    }
  };

;

 const generateToken = (payload,remember) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: remember ? '7d' : '2h' // or '1h', etc.
  });
};

const authMiddleware = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) return res.status(401).json({ error: 'Not authorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};



module.exports = {hashPassword,comparePassword,generateToken,authMiddleware}