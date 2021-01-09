import axios from "axios";
import { useQuery } from "react-query";

export default function useBallot(ballotId = "") {
  return useQuery(
    ["ballot", ballotId],
    () => {
      return new Promise((resolve, reject) => {
        axios
          .get("/api/ballots/" + ballotId)
          .then((response) => {
            const { ballot } = response.data;
            resolve(ballot);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
}
