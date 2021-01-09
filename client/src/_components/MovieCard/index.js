import { BrowserView, MobileView } from "react-device-detect";
import BrowserMovieCard from "./BrowserMovieCard";
import MobileMovieCard from "./MobileMovieCard";

export default function MovieCard(props) {
  return (
    <>
      <BrowserView>
        <BrowserMovieCard {...props} />
      </BrowserView>
      <MobileView>
        <MobileMovieCard {...props} />
      </MobileView>
    </>
  );
}
