const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");


dotenv.config();

const userRouter = require("./routes/user");
const ticketRouter = require("./routes/ticket");
const authRouter = require("./routes/auth");

app.use(helmet());
app.use(cors());
app.use(express.json());

const db = require("./mongoose");

app.get("/", (req, res)=>{
    res.send("Server is running")
})

app.use("/user", userRouter);
app.use("/ticket", ticketRouter);
app.use("/auth", authRouter);

const port = process.env.PORT || 3001

app.listen(port, () => console.log(`Api's are running at the port ${port}`));