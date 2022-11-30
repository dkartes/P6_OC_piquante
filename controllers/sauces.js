const Sauce = require("../models/sauce");
//importe de Node FS (gestionnaire de fichier)
const fs = require("fs");

//fonction pour avoir toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(err => res.status(401).json({ err }));
};

//fonction pour avoir une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(err => res.status(401).json({ err }));
};

//fonction pour poster une sauce
exports.createSauce = (req, res, next) => {
  //on parse cette sauce
  const sauceObject = JSON.parse(req.body.sauce);
  //on supprime le champs id car il est généré par la BDD
  //idem avec userId, on veut l'authentifier par le token  (pour éviter l'usurpation d'id)
  delete sauceObject._id;
  delete sauceObject._userId;
  //on crée la sauce avec ce qui nous a été passé moins les deux champs
  const sauce = new Sauce({
    ...sauceObject,
    _userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "sauce enregistrée" });
    })
    .catch(err => {
      res.status(403).json({ err });
    });
};

//fonction pour modifier une sauce
exports.modifySauce = (req, res, next) => {
  //on extrait notre sauce.
  // On regarde s'il y a un champs file dans notre objet requete. S'il n'y a pas de sauce de transmis, on recupère la sauce directement dans le corp de la requete
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  //on supprime le userId venant de la requete pour éviter que quelqu'un créer une sauce à son nom et le modifie pour l'assigner a quelqu'un d'autre
  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "non authorisé" });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "sauce modifiée" }))
          .catch(err => res.status(401).json({ err }));
      }
    })
    .catch(err => res.status(400).json({ err }));

  //
};

//fonction pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //on s'assure de l'id du user via le token
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "non autorisé" });
        //si c'est le bon user
      } else {
        //on supprime l'image . On recupere le nom de fichier grace a un split
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          //on supprime la sauce
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée" }))
            .catch(err => {
              res.status(403).json({ err });
            });
        });
      }
    })
    .catch(err => {
      res.status(403).json({ err: "Sauce non trouvée" });
    });
};

//fonction de like de sauce
exports.likeSauce = (req, res, next) => {
  //l'user aime la sauce
  if (req.body.like === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      //incrementation du like + push de l'id dans l'array
      {
        $inc: { likes: req.body.like++ },
        $push: { usersLikes: req.body.userId },
      }
    )
      .then(sauce => req.status(200).json({ message: "sauce aimée" }))
      .catch(err => res.status(400).json({ err }));
    //l'utilisateur n'aime pas la sauce
  } else if (req.body.like === -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      //incrementation du unlike + push de l'id dans l'array
      {
        $inc: { unlikes: req.body.like++ * -1 },
        $push: { usersUnlikes: req.body.userId },
      }
    )
      .then(sauce => req.status(200).json({ message: "sauce non-aimée" }))
      .catch(err => res.status(400).json({ err }));
    //l'utilisateur veut changer de like ou l'effacer
  } else {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        if (sauce.usersLikes.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.if },
            {
              $pull: { usersLikes: req.body.userId },
              $inc: { likes: -1 },
            }
          )
            .then(sauce => {
              req.status(200).json({ message: "sauce non-aimée" });
            })
            .catch(err => res.status(400).json({ err }));
        } else if (sauce.usersUnlikes.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.if },
            {
              $pull: { usersUnlikes: req.body.userId },
              $inc: { likes: -1 },
            }
          )
            .then(sauce => {
              req.status(200).json({ message: "sauce non-aimée" });
            })
            .catch(err => res.status(400).json({ err }));
        }
      })
      .catch(err => res.status(400).json({ err }));
  }
};
