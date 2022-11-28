const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//creation du modele d'utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//on applique l'addon de mongoose pour avoir des adresses mails uniques
userSchema.plugin(uniqueValidator);

//on export le model
module.exports = mongoose.model("user", userSchema);
