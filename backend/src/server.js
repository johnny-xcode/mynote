import express from "express"
import notesRoutes from "./notes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
import path from "path"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();


if(process.env.NODE_ENV !== "production")
{
      app.use(cors({origin: "http://localhost:5173"})); // Enable CORS for all routes
}


app.use(express.json()); // middleware to parse JSON request bodies

app.use(rateLimiter); // Apply the rate limiter middleware to all routes

// simple custom middleware to log request method and url
// app.use((req, res, next) => {
//     console.log(`request: ${req.method} & 'request url': ${req.url}`);
//     next();
// });


app.use('/api/notes', notesRoutes);


if(process.env.NODE_ENV === "production")
{
   app.use(express.static(path.join(__dirname,"../frontend/dist")));

   app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname,"../frontend/","dist","index.html"));
   });
}


connectDB().then(() => {
      app.listen(PORT, () => {
         console.log(`Server started on Port: ${PORT}`);
      });  
  }).catch((error) => {console.error("Error starting server:", error)}); 




