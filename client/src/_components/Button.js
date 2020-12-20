import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  disabled: {
    color: "white",
    opacity: 0.7,
  },
  label: {
    color: "white",
    textTransform: "none",
    fontWeight: 500,
    fontSize: "16px",
  },
}));

export default function CustomButton({ children, ...others }) {
  const classes = useStyles();
  return (
    <Button
      classes={{
        label: classes.label,
        disabled: classes.disabled,
      }}
      {...others}
    >
      {children}
    </Button>
  );
}
