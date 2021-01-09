import { useQuery } from "react-query";
import axios from "axios";

export default function useMovie(imdbID) {
  const queryKey = ["movie", imdbID];

  function query() {
    return new Promise((resolve, reject) => {
      axios
        .get("/api/movies/" + imdbID)
        .then((response) => {
          const movie = response.data?.movie;
          resolve(movie);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  const config = {
    enabled: !!imdbID,
  };

  return useQuery(queryKey, query, config);
}
