require("dotenv").config();
const express = require("express");
require("./mongodb/mongoose");
const cors = require("cors");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(taskRouter);
app.use(userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
