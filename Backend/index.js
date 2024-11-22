import express from 'express';
import mongoose  from 'mongoose';
import dotenv from "dotenv";
import roleRoute from "./Routes/roles.js";
import adminRoute from "./Routes/admin.js";

const app = express();

dotenv.config();
app.use(express.json());
//routes
app.use('/quiz/role', roleRoute);
app.use('/quiz/admin', adminRoute);
app.get('/', (req, res) => {
    res.json('Hello, World!');
});

const connectMongoose = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CONNECT);
        console.log('MongoDB Connected...');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
}

app.listen(5000, ()=>{
    connectMongoose();
    console.log('Server is running on port 5000');
});