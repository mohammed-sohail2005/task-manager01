import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows DNS resolution issues (querySrv ECONNREFUSED) with MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (dnsErr) {
  console.warn('[DNS Config Notice]: Defaulting to system DNS servers');
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ [MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
  }
};

export default connectDB;
