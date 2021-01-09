import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translate(-50%, 0)",
  },
  text: {
    color: theme.colors.font,
    transition: "color 0.3s",
    textAlign: "center",
  },
  link: {
    color: theme.palette.primary.main,
  },
}));
export default function Footer() {
  const classes = useStyles();
  return (
    <footer className={classes.root}>
      <p className={classes.text}>
        Made by{" "}
        <a className={classes.link} href="https://garethlau.me">
          Gareth
        </a>{" "}
        🧡
      </p>
    </footer>
  );
}
