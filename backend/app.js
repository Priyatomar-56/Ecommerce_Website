const express = require("express");
const app = express();
app.use(express.json());
const cookie = require("cookie-parser");
const cors = require('cors');
app.use(cors());
app.use(cookie());
const errorMiddleware= require("../backend/middleware/error")

// Route Imports
const product = require("./routes/ProductRoute");
const User = require("./routes/UserRoute");
const Order = require("./routes/Order");

app.use("/api/create", product);
app.use("/api/create", User);
app.use("/api/create", Order);


// middleware for errors
app.use(errorMiddleware);

module.exports=app