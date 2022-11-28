require("dotenv").config({ path: "./config/.env" });
const jwt = require("jsonwebtoken");
const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN;
const UserModel = require("../models/user");

// On export le middleware
module.exports = (req, res, next) => {
  try {
    //on recupere le token on divise la chaine. On recupère le header et le spliter, on divise la chaine de caractère en enlevant la première partie Bearer afin de recup le token
    const token = req.headers.authorization.split(" ")[1];
    //maintenant qu'on a le token, on le décode
    const decodedToken = jwt.verify(token, JWT_SECRET_TOKEN);
    //on recupère le userId
    const userId = decodedToken.userId;
    //on ajoute cette valeure à l'objet request qui lui est transmis aux routes
    req.auth = { userId };
    //si l'userId est different de celui retourné, on indique une erreur. Si tout ok la fonction s'execute
    if (req.body.userId && req.body.userId !== userId) {
      throw "Utilisateur non valable";
    } else {
      next();
    }
  } catch (err) {
    res.status(403).json({ err: "unauthorized request" });
  }
};
