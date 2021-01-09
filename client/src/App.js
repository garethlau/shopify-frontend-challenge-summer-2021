import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { SnackbarProvider } from "notistack";
import { DarkModeProvider } from "./_contexts/darkMode";
import { MovieModalProvider } from "./_contexts/movieModal";
import Home from "./_pages/Home";
import Ballot from "./_pages/Ballot";
import Font from "./_pages/Font";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DarkModeProvider>
        <MovieModalProvider>
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
        </MovieModalProvider>
      </DarkModeProvider>
    </QueryClientProvider>
  );
}

export default App;
