import { useMutation } from "react-query";
import axios from "axios";

export default function useCreateBallot() {
  return useMutation(
    () =>
      new Promise((resolve, reject) => {
        axios
          .post("/api/ballot")
          .then((response) => {
            const { ballot } = response.data;
            resolve(ballot);
          })
          .catch((error) => {
            reject(error);
          });
      })
  );
}
