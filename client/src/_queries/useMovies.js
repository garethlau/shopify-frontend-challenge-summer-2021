import { useInfiniteQuery } from "react-query";
import axios from "axios";

export default function useMovies(title) {
  return useInfiniteQuery(
    ["movies", { active: title }],
    ({ pageParam = 1 }) =>
      new Promise((resolve, reject) => {
        if (title?.trim().length === 0) {
          resolve([]);
        } else {
          axios
            .get("/api/movies?title=" + title + "&page=" + pageParam)
            .then((response) => {
              const { data } = response;
              resolve(data);
            })
            .catch((error) => {
              reject(error);
            });
        }
      }),
    {
      retry: false,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => {
        return lastPage.nextPage;
      },
    }
  );
}
