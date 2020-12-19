import { makeStyles } from "@material-ui/core/styles";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const useStyles = makeStyles((theme) => ({
  movieCard: {
    backgroundColor: "rgb(43, 43, 50)",
    borderRadius: "10px",
    display: "grid",
    gridTemplateColumns: "100px auto 150px",
    margin: "20px 0",
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
      <div style={{ padding: "10px" }}>
        <img style={{ width: "100%", borderRadius: "5px" }} src={poster} />
      </div>
      <div
        style={{
          color: "white",
          display: "table",
          height: "100%",
          padding: "20px",
          textAlign: "left",
        }}
      >
        <div style={{ display: "table-cell", verticalAlign: "middle" }}>
          <h4 style={{ margin: 0 }}>{title}</h4>
          <p style={{ margin: 0 }}>Released: {year}</p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {action}
      </div>
    </motion.div>
  );
}
