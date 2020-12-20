import { useQuery } from "react-query";
import axios from "axios";

export default function useNominatedMovies(ballotId) {
  function query() {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/ballot/${ballotId}/movies`)
        .then((response) => {
          const movies = response.data?.movies;
          resolve(movies);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  const config = {
    enableld: !!ballotId,
  };
  return useQuery(["ballot", ballotId, "movies"], query, config);
}
