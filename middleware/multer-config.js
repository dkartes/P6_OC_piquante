const multer = require("multer");
//Création d'une constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    //on permet au fichier avec un nom avec des espace d'avoir un "_" grace a la méthode join
    const name = file.originalname.split(" ").join("_");
    // l'élément du dicitonnaire qui correspond au Mimetypes du fichier envoyé par le Front end
    const extension = MIME_TYPES[file.mimetype];
    //on appelle le callback avec la création du fiulename entier
    callback(null, name + Date.now() + "." + extension);
  },
});
//on exporte multer
module.exports = multer({ storage }).single("image");
