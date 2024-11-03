import express from "express";
import cors from "cors";

const app = express();



const allowedOrigins = [
    "http://localhost:5173",  
    "https://pro-management-one.vercel.app" 
];
  
 
app.use(cors({
    origin: function (origin, callback) {
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORSpolicy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));


app.use(express.json({ limit: "16kb"}))
app.use(express.urlencoded({ extended:true, limit: "16kb"}))
app.use(express.static("public"));

//Routing Import

import userRouter from "./routes/user.route.js";
import tasksRouter from "./routes/tasks.route.js";


//Route Declaration

app.use('/api/v1/user', userRouter)
app.use('/api/v1/tasks', tasksRouter)










export { app };