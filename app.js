const express = require("express");
require("dotenv").config({ path: "./config/.env" });
const mongoose = require("mongoose");
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
