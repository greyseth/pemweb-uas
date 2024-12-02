const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const authenticateToken = require("./middlewares/authenticateToken");
const verifyRole = require("./middlewares/verifyRole");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(authenticateToken);
app.use(verifyRole);

app.get("/", (req, res) => res.sendStatus(200));

const userRouter = require("./routes/user");
const itemRouter = require("./routes/item");
const orderRouter = require("./routes/order");
app.use("/user", userRouter);
app.use("/item", itemRouter);
app.use("/order", orderRouter);

app.listen(3000, () => console.log("Pemweb API is running"));
