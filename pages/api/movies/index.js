import clientPromise from "../../../lib/mongodb";
/**
 * @swagger
 * /api/movies:
 *     get:
 *         description: Returns movie by year,title and genre
 *         parameters:
 *            - in: header
 *              name: year
 *              schema:
 *                type: integer
 *              required: false
 *            - in: header
 *              name: title
 *              schema:
 *                type: string
 *              required: false
 *            - in: header
 *              name: genres
 *              schema:
 *                type: array
 *                collectionFormat: multi
 *              required: false
 *            - in: header
 *              name: offset
 *              schema:
 *                type: integer
 *              required: false
 *            - in: header
 *              name: limit
 *              schema:
 *                type: integer
 *              required: false
 *         responses:
 *            200:
 *                description: lists of movies that have been filtered by year,title and genre
 *            204:
 *                description: No movie found
 *            400:
 *                description: Bad request parameters
 */
export default async function filterMovies(req, res) {
  // Get body values
  var { year, title, genres, offset, limit } = req.headers;
  var collation = { collation: { locale: "en", strength: 2 } };

  // Query parameters
  var aggr = [];

  if (title) {
    // add the checking field to the query
    aggr.push({
      $addFields: {
        result: {
          $regexMatch: {
            input: "$title",
            regex: title,
            options: "i",
          },
        },
      },
    });
    // check if the result is true
    aggr.push({
      $match: {
        result: true,
      },
    });
    // remove the field from the result
    aggr.push({
      $project: {
        result: 0,
      },
    });
  }

  if (year) {
    if (Number.isInteger(parseInt(year))) {
      aggr.push({
        $match: {
          year: parseInt(year),
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid year" });
    }
  }

  if (genres) {
    aggr.push({
      $match: {
        genres: { $all: genres.split(",") },
      },
    });
  } else {
    genres = {};
  }

  if (offset) {
    if (Number.isInteger(parseInt(offset))) {
      aggr.push({ $skip: parseInt(offset) });
    } else {
      return res.status(400).json({ message: "Invalid offset" });
    }
  }

  if (limit) {
    if (Number.isInteger(parseInt(limit))) {
      aggr.push({ $limit: parseInt(limit) });
    } else {
      return res.status(400).json({ message: "Invalid limit" });
    }
  }

  // DB connection
  const client = await clientPromise;
  const db = client.db("sample_mflix");

  // DB query

  const movies = await db
    .collection("movies")
    .aggregate(aggr, collation)
    .toArray();

  if (movies.length > 0) {
    res.status(200).json({ data: movies });
    return movies;
  } else {
    res.status(204).json({ data: "Movie not found" });
    return [];
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1gb",
    },
  },
};
