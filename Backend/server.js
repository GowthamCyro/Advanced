import dotenv from "dotenv"
dotenv.config({
    path : './.env'
})

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import './src/passport.js';
import passport from "passport";
import session from 'express-session';
import {session as ses}  from "connect-mongo";

import connectDB from "./src/db/index.js";

const app = express()
const MongoStore = ses;

const connection = connectDB();

app.listen(process.env.PORT || 8000,() => {
    console.log(`Server is running at port : ${process.env.PORT}`)
})

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use(passport.initialize());
app.use(passport.session());

const sessionStore = new MongoStore({
    mongoConnection : connection,
    collection : 'sessions'
});

app.use(
    session({
      secret: 'your_secret_key', 
      resave: false,             
      saveUninitialized: true,   
      store : sessionStore,
      cookie: { 
        maxAge : 1000*60*60*24
       }, 
    })
);

app.get("/",(req,res) => {
  res.json("Hello");
})

// import routes
import userRouter from './src/routes/user.routes.js'
import socailRouter from './src/routes/google.routes.js'

//routes Declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/socialSign",socailRouter)

