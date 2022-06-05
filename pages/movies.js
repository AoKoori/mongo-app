export default function Movies({ movies }) {
  return (
    <div>
      <h1>Movies</h1>

      <div className="wrapper">
        {movies.map((movie) => (
          <div key={movie._id} className="card">
            <h2>{movie.title}</h2>
            <img src={movie.poster} />
            <p>{movie.plot}</p>
            <p>
              <span>{movie.imdb.rating} / 10</span>
              <span>votes: {movie.imdb.votes}</span>
            </p>
          </div>
        ))}
      </div>
      <style jsx>{`
        .wrapper {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          grid-gap: 1rem;
        }
        .card {
          position: relative;
          background: #fff;
          padding: 1rem;
          border-radius: 5px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12),
            0 1px 2px rgba(0, 0, 0, 0.24);
        }
        .card img {
          width: 100%;
        }
        .card p:last-of-type {
          position: absolute;
          bottom: 0;
          right: 0;
          left: 0;
          margin: 0;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </div>
  );
}

export async function getServerSideProps() {
  // var year = undefined;
  var title = "star wars";
  // var genres = undefined;
  // var offset = undefined;
  var limit = 100;

  const res = await fetch("http://127.0.0.1:3000/api/movies", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      title: title,
      limit: limit,
    },
  });

  var data = await res.json();
  console.log(data.data);
  return {
    props: {
      movies: data.data,
    },
  };
}
