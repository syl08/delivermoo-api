const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const itemRoutes = require("./api/routes/item");
const itemsRoutes = require("./api/routes/items");
const orderRoutes = require("./api/routes/order");
const ordersRoutes = require("./api/routes/orders");

const port = process.env.PORT || 3000;

mongoose.connect(
  "mongodb+srv://" +
    process.env.MONGODB_NAME +
    ":" +
    process.env.MONGODB_PASS +
    "@cluster0-uvqxg.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }
);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Add authentication header
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "Authentication");
  next();
});

app.get("/",(req,res)=>{
  res.send("This is delivermoo api on google app engine, use express and mongodb.")
})

// Routes which should handle requests
app.use("/item", itemRoutes);
app.use("/items", itemsRoutes);
app.use("/order", orderRoutes);
app.use("/orders", ordersRoutes);

app.listen(port);
