const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://eurowindow_db_user:60aCFnerKgGB9i9z@eurowindowdoor.egn4df0.mongodb.net/eurowindow?retryWrites=true&w=majority&appName=eurowindowdoor';

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB Atlas!');
    process.exit(0);
  } catch (error) {
    console.error('Connection failed:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();
