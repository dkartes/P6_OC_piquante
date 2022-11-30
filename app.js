const express = require("express");
require("dotenv").config({ path: "./config/.env" });
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauces");
const path = require("path");

const app = express();

//initialisation du port
app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});

//connexion à la base de donnée
mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_USER_PASS +
      "@cluster0.zyrqdyr.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion a MongoDB réussie"))
  .catch(() => console.log("Echec de la connexion a MongoDB"));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
