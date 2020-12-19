import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "./theme";

import Home from "./_pages/Home";
import Ballot from "./_pages/Ballot";
import Font from "./_pages/Font";
import { SnackbarProvider } from "notistack";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider
        maxSnack={1}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/ballot/:ballotId" component={Ballot} />
              <Route path="/font" component={Font} />
            </Switch>
          </Router>
        </ThemeProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}

export default App;
