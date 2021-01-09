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
    gridTemplateColumns: "auto 135px",
  },
  info: {
    color: theme.colors.font,
    transition: "color 0.3s",
    height: "100%",
    padding: "20px",
    textAlign: "left",
  },
  action: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
        scale: 0.3,
      }}
      animate={inView ? "visible" : "hidden"}
    >
      <div className={classes.info}>
        <h4 style={{ margin: 0 }}>{title}</h4>
        <p style={{ margin: 0 }}>Released: {year}</p>
      </div>
      <div className={classes.action}>{action}</div>
    </motion.div>
  );
}
