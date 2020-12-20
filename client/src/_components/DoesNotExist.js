import useCreateBallot from "../_mutations/useCreateBallot";
import { makeStyles } from "@material-ui/core/styles";
import Button from "./Button";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    backgroundColor: theme.colors.backgroundColor,
  },
  parent: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  text: {
    color: theme.colors.font,
  },
}));
export default function DoesNotExist() {
  const classes = useStyles();
  const history = useHistory();
  const { mutateAsync: createBallot } = useCreateBallot();

  async function onClick(e) {
    e.preventDefault();
    try {
      const ballot = await createBallot();
      const { code } = ballot;
      history.push("/ballot/" + code);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.parent}>
        <div>
          <p className={classes.text}>
            The ballot you are looking for does not exist.
          </p>
          <Button color="primary" variant="contained" onClick={onClick}>
            Create Ballot
          </Button>
        </div>
      </div>
    </div>
  );
}
