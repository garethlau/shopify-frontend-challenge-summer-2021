import { useState, useEffect, createContext } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { lightTheme, darkTheme } from "../themes";
import CssBaseline from "@material-ui/core/CssBaseline";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    let savedDarkModePreference = localStorage.getItem("prefers-light-mode");
    if (savedDarkModePreference === null) {
      if (prefersDarkMode) {
        setIsDarkMode(true);
      }
    } else {
      setIsDarkMode(savedDarkModePreference);
    }
  }, []);

  function toggle() {
    localStorage.setItem("prefers-light-mode", isDarkMode);
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
