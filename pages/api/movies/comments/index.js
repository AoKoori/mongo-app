import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

// Ajouter un commentaire à un film

/**
 * @swagger
 * /api/movies/comments:
 *   post:
 *       description: Comment on a film
 *       parameters:
 *            - in: header
 *              name: name_user
 *              schema:
 *                type: string
 *              required: true
 *            - in: header
 *              name: mail
 *              schema:
 *                type: string
 *              required: true
 *            - in: header
 *              name: id_movie
 *              schema:
 *                type: string
 *              required: true
 *            - in: header
 *              name: comment
 *              schema:
 *                type: string
 *              required: true
 *       responses:
 *           201:
 *               description: Comment added
 *   get:
 *       description: Returns all comments of a movie
 *       parameters:
 *            - in: header
 *              name: id_movie
 *              schema:
 *                type: string
 *              required: true
 *       responses:
 *           200:
 *               description: list of comments of a movie
 *           204:
 *               description: No comments found
 *
 */

export default async function Comments(req, res) {
  const client = await clientPromise;
  const db = client.db("sample_mflix");
  if (req.method === "POST") {
    const { name_user, mail, id_movie, comment } = req.headers;
    const comments = await db.collection("comments").insertOne({
      name: name_user,
      email: mail,
      movie_id: ObjectId(id_movie),
      text: comment,
      date: new Date(),
    });

    // Renvoie ok si le com est ajouté sinon erreur.
    if (comments) {
      res.status(201).json({ data: "Commentaire ajouté" });
    } else {
      res.status(404).json({ data: "Erreur" });
    }
  } else if (req.method === "GET") {
    const { id_movie } = req.headers;
    // On récupère tous les commentaires de l'utilisateur
    const comments = await db
      .collection("comments")
      .find({ movie_id: ObjectId(id_movie) })
      .toArray();
    if (comments.length > 0) {
      return res.status(200).json({ data: comments });
    } else {
      return res.status(204).json({ data: "Aucun commentaire trouvé" });
    }
  }
}
