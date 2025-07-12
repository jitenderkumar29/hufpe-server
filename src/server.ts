import app from "./app";
import connectDB from "./config/db";
import dotenv from "dotenv";

dotenv.config();
console.log("dotenv.config()");
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL;
console.log("BASE_URL, PORT", BASE_URL, PORT);

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
  );
});
