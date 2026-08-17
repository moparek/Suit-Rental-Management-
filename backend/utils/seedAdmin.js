const User = require("../Models/userModel");

// Default Admin account array for cloned environments
const defaultAdmins = [
  {
    name: "System Admin",
    email: "admin@gmail.com",
    phone: "0987654321",
    password: "admin123456",
    role: "admin",
    status: "active",
  },
];

const seedAdmins = async () => {
  try {
    for (const adminData of defaultAdmins) {
      const existingUser = await User.findOne({ email: adminData.email });
      if (!existingUser) {
        await User.create(adminData);
        console.log(`[Seed] Created default admin: ${adminData.email}`);
      }
    }
  } catch (error) {
    console.error("[Seed] Error seeding default admin account:", error.message);
  }
};

module.exports = { seedAdmins, seedUsers: seedAdmins, defaultAdmins, defaultUsers: defaultAdmins };
