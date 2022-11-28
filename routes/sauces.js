const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const saucesCtrl = require("../controllers/sauces");

//Création des routes des sauces
// trouver toutes les sauces
router.get("/", auth, saucesCtrl.getAllSauces);
// trouver une sauce spécifique
router.get("/:id", auth, saucesCtrl.getOneSauce);
// poster une sauce
router.post("/", auth, multer, saucesCtrl.createSauce);
// modifier une sauce
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
//supprimer une sauce
router.delete("/:id", auth, saucesCtrl.deleteSauce);
//like de sauce
router.post(":id/like", auth, saucesCtrl.likeSauce);

module.exports = router;
