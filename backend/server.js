const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const Image = require("./model"); 
const route = require("./routes")

const app = express();
app.use(cors());
app.use("/api/images",route) // allow React to access backend


mongoose
  .connect("mongodb://127.0.0.1:27017/multer-demo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

  const storage = multer.memoryStorage();
  const upload = multer({storage})


// Start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));