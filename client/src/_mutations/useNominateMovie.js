import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

export default function useNominateMovie(ballotId) {
  const queryClient = useQueryClient();

  const queryKey = ["ballot", ballotId, "movies"];

  function mutate({ movie, action }) {
    return new Promise((resolve, reject) => {
      const { imdbID } = movie;
      axios
        .patch(`/api/ballots/${ballotId}/nominate`, {
          imdbID,
          action,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  async function onMutate({ movie, action }) {
    // Cancel any outgoing refetches
    await queryClient.cancelQueries(queryKey);

    // Save a snapshot of currently nominated movies
    const snapshot = queryClient.getQueryData(queryKey);

    // Optimistically set new nominated movie data
    if (action === "nominate") {
      // Nominate a movie
      queryClient.setQueryData(queryKey, (prev = []) => {
        return [...prev, movie];
      });
    } else {
      // Withdraw nomination
      queryClient.setQueryData(queryKey, (prev) => {
        let newMovies = prev.filter((m) => m.imdbID !== movie.imdbID);
        return newMovies;
      });
    }

    // Return context with snapshot
    return { snapshot };
  }

  function onError(_0, _1, context) {
    queryClient.setQueryData(queryKey, context.snapshot);
  }

  function onSettled() {
    // Refetch nominated movies
    queryClient.invalidateQueries("ballot");
    queryClient.invalidateQueries(queryKey);
  }

  const config = {
    onMutate,
    onError,
    onSettled,
  };

  return useMutation(mutate, config);
}
