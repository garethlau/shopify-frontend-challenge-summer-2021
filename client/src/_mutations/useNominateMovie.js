import { useMutation } from "react-query";
import axios from "axios";

export default function useNominateMovie(ballotId) {
  return useMutation(
    ({ imdbID, action }) =>
      new Promise((resolve, reject) => {
        axios
          .patch(`/api/ballot/${ballotId}/nominate`, {
            imdbID,
            action,
          })
          .then((response) => {
            console.log(response);
            resolve(response);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      })
  );
}
