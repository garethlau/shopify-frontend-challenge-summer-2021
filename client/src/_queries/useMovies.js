import { useQuery } from "react-query";
import axios from "axios";

export default function useMovies(title) {
  return useQuery(
    ["movies", { active: title }],
    () =>
      new Promise(
        (resolve, reject) => {
          axios
            .get("/api/movie?title=" + title)
            .then((response) => {
              const movies = response.data?.movies;
              resolve(movies);
            })
            .catch((error) => {
              reject(error);
            });
        },
        {
          retry: false,
        }
      )
  );
}
