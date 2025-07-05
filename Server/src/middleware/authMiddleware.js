import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const verifyToken = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select('-password'); 

    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = user; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};