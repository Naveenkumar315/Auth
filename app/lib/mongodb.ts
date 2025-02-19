import mongoose from "mongoose";

const MONGODB_URI: string = process.env.MONGOD_URL || "";

async function connectToDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  const opts = {
    bufferCommands: false,
  };
  await mongoose.connect(MONGODB_URI, opts);
  return mongoose;
}

export default connectToDB;
