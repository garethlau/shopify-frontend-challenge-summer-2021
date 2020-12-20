import { makeStyles } from "@material-ui/core/styles";
import useCreateBallot from "../_mutations/useCreateBallot";
import Button from "../_components/Button";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import { motion } from "framer-motion";
import DarkModeSwitch from "../_components/DarkModeSwitch";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    backgroundColor: theme.colors.backgroundColor,
    transition: "background-color 0.3s",
  },
  content: {
    [theme.breakpoints.up("sm")]: {
      width: "640px",
      height: "400px",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      padding: 0,
    },
    paddingTop: "150px",
    color: theme.colors.font,
    transition: "color 0.3s",
    textAlign: "center",
  },
  introText: {
    fontSize: "4rem",
  },
}));

export default function Home() {
  const classes = useStyles();
  const { mutateAsync: createBallot } = useCreateBallot();
  const history = useHistory();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  async function onClick(e) {
    e.preventDefault();
    try {
      const ballot = await createBallot();
      const { code } = ballot;
      history.push("/ballot/" + code);
    } catch (error) {
      console.log(error);
      enqueueSnackbar("There was an error.", { variant: "error" });
    }
  }

  return (
    <div className={classes.root}>
      <DarkModeSwitch />
      <div className={classes.content}>
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0 }}
        >
          <h1 className={classes.introText}>Welcome to the Shoppies</h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button color="primary" variant="contained" onClick={onClick}>
            Get Started
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
