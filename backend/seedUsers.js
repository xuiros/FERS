require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const users = [
  {
    fullName: 'Admin R5',
    email: 'r5station@bfp.gov.ph',
    password: 'r5password',
    role: 'station_admin',
    assignedStation: {
      name: 'R5 Station',
      address: '281, 217 F. Aquende Dr, Legazpi City, Albay',
      latitude: 13.14347,
      longitude: 123.734662,
    },
  },
  {
    fullName: 'Admin Legazpi Port',
    email: 'legazpiport@bfp.gov.ph',
    password: 'portpassword',
    role: 'station_admin',
    assignedStation: {
      name: 'Legazpi Port Station',
      address: '4QR5+JX3, Governor Locsin Street, Legazpi Port District, Legazpi City, Albay',
      latitude: 13.141651,
      longitude: 123.759995,
    },
  },
  {
    fullName: 'Admin Sub Station 1',
    email: 'substation1@bfp.gov.ph',
    password: 'sub1password',
    role: 'station_admin',
    assignedStation: {
      name: 'Sub Station 1',
      address: '128 Peñaranda St, Legazpi Port District, Legazpi City, 4500 Albay',
      latitude: 13.151506,
      longitude: 123.752768,
    },
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB...');

    for (const user of users) {
      const exists = await User.findOne({ email: user.email });
      if (!exists) {
        const newUser = new User(user);
        await newUser.save();
        console.log(`✅ Created: ${user.email}`);
      } else {
        console.log(`⚠️ Already exists: ${user.email}`);
      }
    }

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
