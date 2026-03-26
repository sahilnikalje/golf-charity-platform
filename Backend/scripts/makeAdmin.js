const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/userModel");

const EMAIL = process.argv[2];

if (!EMAIL) {
  console.log("Usage: node scripts/makeAdmin.js your@email.com");
  process.exit(1);
}

async function makeAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOneAndUpdate(
    { email: EMAIL },
    { role: "admin" },
    { new: true }
  );
  if (!user) {
    console.log(`No user found with email: ${EMAIL}`);
    console.log("Make sure you have registered on the site first.");
  } else {
    console.log(`Done! ${user.name} (${user.email}) is now an admin.`);
  }
  mongoose.disconnect();
}

makeAdmin();
