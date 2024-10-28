import dotenv from "dotenv";
dotenv.config({ path: './.env' });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import './src/passport.js';
import passport from "passport";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import connectDB from "./src/db/index.js";

const app = express();

// Database connection and session store setup
const client = await connectDB(); // Await client connection

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Configure session with MongoStore
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'your_secret_key',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            client,                   // Directly pass client for MongoDB session storage
            collectionName: 'sessions', // Store sessions in the 'sessions' collection
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            secure: process.env.NODE_ENV === 'production', // Secure cookies in production
        },
    })
);

// Passport.js initialization
app.use(passport.initialize());
app.use(passport.session());

// Basic route
app.get("/", (req, res) => {
    res.json("Hello");
});

// Import and declare routes
import userRouter from './src/routes/user.routes.js';
import socialRouter from './src/routes/google.routes.js';
app.use("/api/v1/users", userRouter);
app.use("/api/v1/socialSign", socialRouter);

// Start the server
app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running at port: ${process.env.PORT || 8000}`);
});
