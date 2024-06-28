import express, { Express } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import authRouter from './routes/auth.router';
import reportRouter from './routes/report.router';
import bodyParser from 'body-parser';
import { Pool } from "pg";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

const MONGO_URL: string = process.env.DATABASE_URL || 'mongodb://localhost/gemastik-ui-backend';

// Set up MongoDB connection options
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 2 * 60 * 60 * 1000, // 2 hours for server selection timeout
    connectTimeoutMS: 2 * 60 * 60 * 1000, // 2 hours for connection timeout
    bufferCommands: false, // Disable Mongoose buffering
};





// Connect to MongoDB using mongoose.connect
mongoose.connect(MONGO_URL, mongooseOptions)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process on MongoDB connection error
    });

// Initialize GridFSBucket for file uploads
export let gfsBucket: any;

const conn = mongoose.connection; // Get default mongoose connection

conn.once('open', () => {
    gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads' // Replace with your bucket name
    });
});

// Middleware for parsing JSON bodies
app.use(express.json({ limit: '100mb' }));

// Middleware body-parser untuk parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Other middleware
app.use(cookieParser());

const corsOptions = {
    origin: 'https://warga-jaga-production.up.railway.app',
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,POST,PUT',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
};

app.use(cors(corsOptions));

// Routes
app.use('/auth', authRouter);
app.use('/reports', reportRouter);

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

