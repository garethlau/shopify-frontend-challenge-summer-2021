import { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MovieModalContext } from "../../_contexts/movieModal";

const useStyles = makeStyles((theme) => ({
  movieCard: {
    backgroundColor: theme.type === "dark" ? "rgb(43, 43, 50)" : "#ffffff",
    transition: "background-color 0.3s",
    borderRadius: "10px",
    display: "grid",
    margin: "20px 0",
    boxShadow: theme.shadows[5],
    gridTemplateColumns: "100px auto 150px",
    gridTemplateRows: "auto",
    gridTemplateAreas: "'poster info action'",
  },
  poster: {
    gridArea: "poster",
    padding: "10px",
  },
  info: {
    gridArea: "info",
    color: theme.colors.font,
    transition: "color 0.3s",
    display: "table",
    height: "100%",
    padding: "20px",
    textAlign: "left",
    "& > div": {
      display: "table-cell",
      verticalAlign: "middle",
    },
    "&:hover": {
      cursor: "pointer",
    },
  },
  action: {
    gridArea: "action",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function MovieCard({ poster, title, year, action, imdbID }) {
  const classes = useStyles();
  const [ref, inView] = useInView({ triggerOnce: true });
  const { open } = useContext(MovieModalContext);

  return (
    <motion.div
      className={classes.movieCard}
      ref={ref}
      initial="hidden"
      variants={{
        hidden: {
          opacity: 0,
          y: 50,
          scale: 0.5,
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
        },
      }}
      exit={{
        opacity: 0,
        y: 100,
        scale: 0.3,
      }}
      animate={inView ? "visible" : "hidden"}
    >
      <div className={classes.poster}>
        <img
          style={{ width: "100%", borderRadius: "5px" }}
          src={poster}
          alt=""
        />
      </div>
      <div className={classes.info} onClick={() => open(imdbID)}>
        <div>
          <h4 style={{ margin: 0 }}>{title}</h4>
          <p style={{ margin: 0 }}>Released: {year}</p>
        </div>
      </div>
      <div className={classes.action}>{action}</div>
    </motion.div>
  );
}
