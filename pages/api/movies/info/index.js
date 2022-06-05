import clientPromise from "../../../../lib/mongodb";
const ObjectId = require("mongodb").ObjectId;
/**
 * @swagger
 * /api/movies/info:
 *     get:
 *         description: Returns movie information
 *         parameters:
 *            - in: header
 *              name: id
 *              schema:
 *                type: string
 *              required: true
 *         responses:
 *            200:
 *                description: information about selected movie
 *            204:
 *                description: No movie found
 */
export default async function getFilmDetails(req, res) {
  const { id } = req.headers;
  var mongoId = new ObjectId(id);
  const client = await clientPromise;
  const db = client.db("sample_mflix");
  const movie = await db.collection("movies").find({ _id: mongoId }).toArray();
  if (movie.length > 0) {
    res.status(200).json(movie);
    return {
      props: {
        movie: movie,
      },
    };
  } else {
    res.status(204).json({ message: "No movie found" });
    return {
      props: {
        movie: [],
      },
    };
  }
}
