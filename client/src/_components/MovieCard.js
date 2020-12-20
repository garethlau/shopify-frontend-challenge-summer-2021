import { makeStyles } from "@material-ui/core/styles";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

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
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "100px auto",
      gridTemplateRows: "auto 55px",
      gridTemplateAreas: "'poster info' 'poster action'",
    },
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
    [theme.breakpoints.down("sm")]: {
      padding: "5px 20px",
      height: "40px",
    },
  },
  action: {
    gridArea: "action",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "left",
      paddingLeft: "20px",
    },
  },
}));

export default function MovieCard({ poster, title, year, action }) {
  const classes = useStyles();
  const [ref, inView] = useInView({ triggerOnce: true });
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
        scale: 0.7,
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
      <div className={classes.info}>
        <div>
          <h4 style={{ margin: 0 }}>{title}</h4>
          <p style={{ margin: 0 }}>Released: {year}</p>
        </div>
      </div>
      <div className={classes.action}>{action}</div>
    </motion.div>
  );
}
