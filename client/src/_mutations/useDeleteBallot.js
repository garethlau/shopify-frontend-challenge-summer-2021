import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

export default function useDeleteBallot(ballotCode) {
  const queryClient = useQueryClient();

  function mutate() {
    return new Promise((resolve, reject) => {
      axios
        .delete("/api/ballots/" + ballotCode)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function onSettled() {
    // Clear the cache
    queryClient.invalidateQueries(["ballot", ballotCode]);
  }

  const config = {
    onSettled,
  };

  return useMutation(mutate, config);
}
