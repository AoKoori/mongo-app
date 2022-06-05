const ObjectId = require("mongodb").ObjectId;
import clientPromise from "../../../../lib/mongodb";

/**
 * @swagger
 * /api/movies/favorites:
 *   post:
 *       description: Adding a favorite to a user
 *       parameters:
 *            - in: header
 *              name: id_user
 *              schema:
 *                type: string
 *            - in: header
 *              name: id_movie
 *              schema:
 *                type: string
 *       responses:
 *           201:
 *               description: film added to favorites
 *   get:
 *       description: Returns all favorites of a user
 *       parameters:
 *            - in: header
 *              name: id_user
 *              schema:
 *                type: string
 *              required: true
 *       responses:
 *           200:
 *               description: list of favorites of a user
 *           204:
 *               description: No favorites found
 */

export default async function postFav(req, res) {
  const client = await clientPromise;
  const db = client.db("sample_mflix");

  // On récupère les paramètres du user dans une constante
  const { id_user, id_movie } = req.headers;

  if (req.method === "POST") {
    // On rentre dans la collection (création si non existante) et on insère l'id user + l'id movie
    console.log(id_user, id_movie);
    const favorites = await db
      .collection("favorites")
      .insertOne({ id_user: ObjectId(id_user), movie_id: ObjectId(id_movie) });

    // Renvoie ok si le fav est ajouté sinon erreur.
    if (favorites) {
      console.log("favorites :", favorites);
      res.status(200).json({ data: "Favori ajouté à l'utilisateur" });
    } else {
      res.status(404).json({ data: "Erreur" });
    }
  } else if (req.method === "GET") {
    // On récupère tous les favoris de l'utilisateur
    const favorites = await db
      .collection("favorites")
      .find({ id_user: ObjectId(id_user) })
      .toArray();

    if (favorites.length > 0) {
      return res.status(200).json({ data: favorites });
    } else {
      return res.status(204).json({ data: "Aucun favori trouvé" });
    }
  }
}
