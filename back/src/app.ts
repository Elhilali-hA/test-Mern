import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db'; 
import analyticsRoutes from './routes/analyticsRoutes'; 

dotenv.config(); 

const app = express();


connectDB();

app.use(express.json());


app.use('/analytics', analyticsRoutes);  

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
