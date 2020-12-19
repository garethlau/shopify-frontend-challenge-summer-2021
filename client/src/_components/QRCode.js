import { useParams } from "react-router-dom";
import QRCode from "qrcode.react";
import { makeStyles } from "@material-ui/core/styles";

const ORIGIN = process.env.REACT_APP_ORIGIN || "localhost:3000";

const useStyles = makeStyles((theme) => ({
  root: {},
  qr: {
    boxShadow: theme.shadows[5],
  },
}));

export default function QRCodeWrapper() {
  const { ballotId } = useParams();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <QRCode
        className={classes.qr}
        value={`${ORIGIN}/ballot/${ballotId}`}
        size={200}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"L"}
        includeMargin={false}
        renderAs={"svg"}
        // imageSettings={{
        //   src: require("../assets/images/balloon.png"),
        //   x: null,
        //   y: null,
        //   height: 24,
        //   width: 24,
        //   excavate: true,
        // }}
      />
    </div>
  );
}
