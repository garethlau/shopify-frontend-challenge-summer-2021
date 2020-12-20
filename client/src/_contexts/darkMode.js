import { useState, useEffect, createContext } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { lightTheme, darkTheme } from "../themes";
import CssBaseline from "@material-ui/core/CssBaseline";

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  function toggle() {
    console.log("Is Dark Mode? ", isDarkMode);
    setIsDarkMode(!isDarkMode);
  }

  return (
    <DarkModeContext.Provider value={{ toggle, isDarkMode }}>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />

        {children}
      </ThemeProvider>
    </DarkModeContext.Provider>
  );
};
