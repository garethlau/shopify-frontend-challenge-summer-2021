import axios from "axios";
import { useQuery } from "react-query";

export default function useBallot(ballotId) {
  return useQuery(["ballot", ballotId], () => {
    return new Promise((resolve, reject) => {
      axios
        .get("/api/ballot/" + ballotId)
        .then((response) => {
          const { ballot } = response.data;
          resolve(ballot);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
}
