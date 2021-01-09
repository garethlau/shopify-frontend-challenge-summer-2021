import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import useMovie from "../_queries/useMovie";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    backgroundColor: theme.palette.background.paper,
    border: "none",
    outline: "none",
    boxShadow: theme.shadows[5],
    padding: "20px",
    width: "90%",
    maxWidth: "640px",
    height: "70%",
    overflowY: "auto",
    borderRadius: "5px",
    "& > h1": {
      fontSize: "30px",
      margin: 0,
    },
    "& > h2": {
      fontSize: "20px",
      fontFamily: "Courgette",
      margin: "15px 0 5px",
    },
    "& > p": {
      margin: 0,
      fontFamily: "Open Sans",
      fontSize: "16px",
    },
  },
  poster: {
    width: "100%",
    borderRadius: "5px",
  },
}));

export default function MovieModal({ isOpen, close, imdbID }) {
  const classes = useStyles();
  const { data } = useMovie(imdbID);

  return (
    <Modal
      open={isOpen}
      onClose={close}
      className={classes.modal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpen}>
        <div className={classes.content}>
          <div>
            {data?.Poster ? (
              <img src={data?.Poster || ""} className={classes.poster} />
            ) : (
              <Skeleton variant="rect" height={300} />
            )}
          </div>
          <h1>{data?.Title || <Skeleton />}</h1>
          <h2>Released</h2>
          <p>{data?.Released || <Skeleton />}</p>
          <h2>Plot</h2>
          <p>{data?.Plot || <Skeleton />}</p>
          <h2>Runtime</h2>
          <p>{data?.Runtime || <Skeleton />}</p>
          <h2>Rated</h2>
          <p>{data?.Rated || <Skeleton />}</p>
          <h2>Actors</h2>
          <p>{data?.Actors || <Skeleton />}</p>
          <h2>Director</h2>
          <p>{data?.Director || <Skeleton />}</p>
          <h2>Awards</h2>
          <p>{data?.Awards || <Skeleton />}</p>
          <h2>Rating</h2>
          <p>{data?.imdbRating || <Skeleton />}</p>
        </div>
      </Fade>
    </Modal>
  );
}
