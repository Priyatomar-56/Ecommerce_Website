const mongoose = require("mongoose")
const dotenv = require("dotenv");
dotenv.config({ path: "backend/config/.env" })
if (!process.env.DB) {
    console.error('DB environment variable is not defined.');
    process.exit(1); // Exit the process if DB is not defined
}


mongoose.connect(process.env.DB).then(() => {
    console.log("Connected to DB....");
}).catch((err) => {
    console.log(process.env.DB);
    console.log('Error connecting to MongoDB:',err);
});