import axios from "axios";

export default async function checkExists(ballotId) {
  try {
    const response = await axios.get(`/api/ballot/${ballotId}`);
    const ballot = response.data?.ballot;
    if (!ballot) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}
