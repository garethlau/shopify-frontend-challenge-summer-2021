import { createMuiTheme } from "@material-ui/core/styles";

import CourgetteRegularTtf from "./_fonts/Courgette-Regular.ttf";

const courgette = {
  fontFamily: "Courgette",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
    local('Courgette'),
    local('Courgette-Regular'),
    url(${CourgetteRegularTtf}) format('truetype')
  `,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

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
    fontFamily: "Courgette, Arial",
    fontSize: 18,
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "@font-face": [courgette],
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
