import { createMuiTheme } from "@material-ui/core/styles";

const base = {
  palette: {
    primary: {
      main: "#F2A826",
    },
    secondary: {
      main: "#A4BBB2",
    },
    warning: {
      main: "#fb9d0c",
    },
    error: { main: "#f44336" },
    success: { main: "#7eae44" },
    info: { main: "#2c4443" },
    common: {
      white: "#F8F7F7",
    },
  },
  typography: {
    fontFamily: ["Open Sans", "sans-serif"],
    fontSize: 18,
    h1: {
      fontFamily: ["Courgette", "cursive"],
      fontSize: "2em",
      margin: "10px",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*::-webkit-scrollbar": {
          width: "0.4em",
        },
        "*::-webkit-scrollbar-track": {
          "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "#F2A826",
        },
      },
    },
  },
};

export const darkTheme = createMuiTheme({
  type: "dark",
  ...base,
  colors: {
    darkAccent: "#C94B44",
    darkShade: "#413F51",
    lightShade: "#F2F6F1",
    lightAccent: "#90B4B3",
    backgroundColor: "#413F51",
    font: "#FFFFFF",
  },
});

export const lightTheme = createMuiTheme({
  type: "light",
  ...base,
  colors: {
    darkAccent: "#ff0005",
    darkShade: "#ff0005",
    lightShade: "#F2F6F1",
    lightAccent: "#90B4B3",
    backgroundColor: "#f2eee2",
    font: "#000000",
  },
});
