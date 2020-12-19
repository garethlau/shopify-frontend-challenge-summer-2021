import { makeStyles } from "@material-ui/core/styles";

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
  return (
    <div className={classes.movieCard}>
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
    </div>
  );
}
