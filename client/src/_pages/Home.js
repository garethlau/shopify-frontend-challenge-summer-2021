import { makeStyles } from "@material-ui/core/styles";
import useCreateBallot from "../_mutations/useCreateBallot";
import Button from "../_components/Button";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    backgroundColor: theme.colors.darkShade,
  },
  content: {
    width: "400px",
    height: "300px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "white",
    textAlign: "center",
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
      <div className={classes.content}>
        <h1>Welcome to the Shoppies</h1>
        <Button color="primary" variant="contained" onClick={onClick}>
          Get Started
        </Button>
      </div>
    </div>
  );
}
