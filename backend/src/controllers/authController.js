const User = require('../models/User');

// ✅ Register
const register = async (req, res) => {
  try {
    console.log('📝 Register Request:', req.body);
    
    const { uid, name, email, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ uid }, { email }] });
    if (userExists) {
      return res.json({ 
        success: true, 
        user: userExists,
        message: 'User already exists' 
      });
    }

    // Create user with Firebase UID
    const user = await User.create({ 
      uid, 
      name: name || email.split('@')[0],  // ← যদি name না আসে, email থেকে নিবে
      email, 
      phone: phone || '' 
    });
    
    console.log('✅ User Created:', user.email);
    
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        uid: user.uid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('❌ Register Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// ✅ Login
const login = async (req, res) => {
  try {
    const { uid, email } = req.body;
    
    console.log('🔐 Login Request:', { uid, email });

    // Find user by uid or email
    let user = await User.findOne({ $or: [{ uid }, { email }] });
    
    if (!user) {
      // Create new user if not exists
      user = await User.create({
        uid,
        email,
        name: email.split('@')[0],
        phone: ''
      });
      console.log('✅ New user created during login:', user.email);
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        uid: user.uid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

const getMe = async (req, res) => {
  try {
    const { uid } = req.query;  // ← URL থেকে uid নিবে
    
    console.log('📋 Getting user by UID:', uid);
    
    if (!uid) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID (uid) is required' 
      });
    }

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    console.log('✅ User found:', user.email);
    
    res.json({ 
      success: true, 
      user: {
        id: user._id,
        uid: user.uid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    });
    
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = { register, login, getMe };