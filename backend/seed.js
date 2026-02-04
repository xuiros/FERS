require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // adjust path if needed

// 🧍 Only mobile app users (no admin/station accounts)
const appUsers = [
  {
    fullName: 'Dave Echague',
    email: 'echagedave@gmail.com',
    password: '1234',
    role: 'responder',
  },
  {
    fullName: 'Mark Relao',
    email: 'mark6gmail.com',
    password: '1234',
    role: 'citizen',
  },
];

const seedAppUsers = async () => {
  try {
    // 🧠 Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/emergency');
    console.log('✅ MongoDB connected.');

    const result = await User.deleteMany({
      role: { $in: ['citizen', 'responder'] },
    });
    console.log(`🧽 Removed ${result.deletedCount} old citizen/responder users.`);

    // 🔐 Hash passwords
    for (const user of appUsers) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    await User.insertMany(appUsers);
    console.log('✅ App users successfully seeded!');
    console.table(appUsers.map(u => ({ email: u.email, role: u.role })));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding app users:', error);
    process.exit(1);
  }
};

seedAppUsers();
