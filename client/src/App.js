import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { darkTheme, lightTheme } from "./themes";

import Home from "./_pages/Home";
import Ballot from "./_pages/Ballot";
import Font from "./_pages/Font";
import { SnackbarProvider } from "notistack";
import { DarkModeProvider } from "./_contexts/darkMode";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DarkModeProvider>
        <SnackbarProvider
          maxSnack={1}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Router>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/ballot/:ballotId" component={Ballot} />
              <Route path="/font" component={Font} />
            </Switch>
          </Router>
        </SnackbarProvider>
      </DarkModeProvider>
    </QueryClientProvider>
  );
}

export default App;
