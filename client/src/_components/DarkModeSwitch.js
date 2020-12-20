import { useContext } from "react";
import Switch from "@material-ui/core/Switch";
import { makeStyles } from "@material-ui/core/styles";
import { DarkModeContext, DarkModeProvider } from "../_contexts/darkMode";

const THUMB_ACTIVE_COLOR = "white";
const THUMB_INACTIVE_COLOR = "white";

const TRACK_ACTIVE_COLOR = "#fdb813";
const TRACK_INACTIVE_COLOR = "#0b2e46";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
  },
  switchBase: {
    color: THUMB_INACTIVE_COLOR,
    padding: 1,
    "&$checked": {
      transform: "translateX(16px)",
      color: THUMB_ACTIVE_COLOR,
      "& + $track": {
        backgroundColor: TRACK_ACTIVE_COLOR,
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: THUMB_ACTIVE_COLOR,
      border: "6px solid #fff",
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    // border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: TRACK_INACTIVE_COLOR,
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
  focusVisible: {},
}));

export default function DarkModeSwitch(props) {
  const classes = useStyles();
  const { isDarkMode, toggle } = useContext(DarkModeContext);

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        zIndex: "10",
      }}
    >
      <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
        checked={isDarkMode}
        onClick={toggle}
        {...props}
      />
    </div>
  );
}
