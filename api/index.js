import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import { User } from "./models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({
    path:'./.env'
});

const app=express();
const PORT=process.env.PORT
console.log(PORT)
app.use(express.json()); // This will parse the incoming request in json format
app.use(cors({
    credentials:true,
    origin:process.env.CORS_ORIGIN
}));
app.use(cookieParser());
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(`Database connection failed: ${err}`));
const jwtSecret=process.env.JWT_SECRET
app.get('/test',(req,res)=>{
    res.json({message:"Hello World"});
})
app.post('/register',async(req,res)=>{
    const {username,password}=req.body;
    try{
        const hashedPassword= await bcrypt.hash(password,10);
        const createdUser= await User.create({
            username:username,
            password:hashedPassword,
        })

        // In the jwt sign we are passing an empty object this used to contains the expiresIn property but we don't want to use it hence i am passing an empty object
        //Also in res.cookie() we are using secure:true it helps set the cookie on https request and is considered as best security practice.
        //Also the sameSite:"none" is used in cases suppose if our frontend is hosted on vercel and backend on render then if we don't use then only the backend would ne able to send cookies to the frontend else not.
        jwt.sign({userId:createdUser._id,username},jwtSecret,{},(err,token)=>{
            if(err) throw err;
            res.cookie("token",token,{sameSite:'none',secure:true}).status(201).json({
                id:createdUser._id,
            });
        });
    }
    catch(err)
    {
        if(err)
            {
                console.error(err);
                res.status(500).json({message:"Error creating user"});
            }
    }
})
app.get('/profile',(req,res)=>{
    const token=req.cookies?.token;
    if(token)
        {
            jwt.verify(token,jwtSecret,{},(err,userData)=>{
                if(err) throw err
                res.json(userData);
            })
            
        }
        else{
            res.status(401).json('Invalid Token')
        }
});
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const foundUser = await User.findOne({ username });

        // Check if user exists
        if (!foundUser) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        // Check if the password matches
        const passOk = await bcrypt.compare(password, foundUser.password);
        if (passOk) {
            jwt.sign({ userId: foundUser._id, username }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie("token", token, { sameSite: 'none', secure: true })
                    .status(200)
                    .json({ id: foundUser._id });
            });
        } else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error logging in" });
    }
});

app.post('/logout',(req,res)=>{
    res.cookie('token','',{sameSite:'none',secure:true}).json('ok');
})
app.listen(PORT,()=>{
    console.log(`Server is running on  http://localhost:${PORT}` );
})