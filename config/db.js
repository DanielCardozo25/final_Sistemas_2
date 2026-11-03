import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const conectarDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'tienda_insumos_db'
    });
    console.log(`MongoDB conectado: ${conn.connection.host} - DB: tienda_insumos_db`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default conectarDB;

