import React, { useEffect, useState, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import LinkIcon from "@material-ui/icons/Link";
import { useParams, useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { CopyToClipboard } from "react-copy-to-clipboard";
import useBallot from "../_queries/useBallot";
import useMovies from "../_queries/useMovies";
import useTextField from "../_hooks/useTextField";
import useDebounce from "../_hooks/useDebounce";
import Button from "../_components/Button";
import DoesNotExist from "../_components/DoesNotExist";
import QRCode from "../_components/QRCode";
import MovieCard from "../_components/MovieCard";
import DarkModeSwitch from "../_components/DarkModeSwitch";
import useNominateMovie from "../_mutations/useNominateMovie";
import useDeleteBallot from "../_mutations/useDeleteBallot";
import useNominatedMovies from "../_queries/useNominatedMovies";
import checkExists from "../_utils/checkExists";

const ORIGIN = process.env.REACT_APP_ORIGIN || "localhost:3000";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    minHeight: "100vh",
    backgroundColor: theme.colors.backgroundColor,
    transition: "background-color 0.3s",
    paddingTop: "100px",
    paddingBottom: "200px",
    "& h1": {
      color: theme.palette.primary.main,
    },
  },
  container: {
    maxWidth: "640px",
    margin: "auto",
    textAlign: "center",
    color: theme.colors.font,
    transition: "color 0.3s",
    [theme.breakpoints.down("sm")]: {
      width: "90vw",
    },
  },
  link: {
    "&:hover": {
      cursor: "pointer",
      borderBottom: "3px solid",
      transition: "ease 0.3s",
    },
  },
  search: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    fontSize: "22px",
    fontFamily: "Courgette",
    border: "none",
    outline: "none",
  },
  completeBanner: {
    backgroundColor: theme.palette.success.main,
    padding: "10px",
    borderRadius: "10px",
  },
  deleteBtn: {
    margin: "40px 0 20px",
    backgroundColor: "#f44336",
    "&:hover": {
      backgroundColor: "#cf2f23",
    },
  },
}));

const Status = {
  EXISTS: "EXISTS",
  DOES_NOT_EXIST: "DOES_NOT_EXIST",
  LOADING: "LOADING",
};

const EVENT_SOURCE_URL =
  process.env.NODE_ENV === "production"
    ? "https://shoppies.garethdev.space"
    : "http://localhost:5000";

export default function Ballot() {
  const { ballotId } = useParams();
  const classes = useStyles();
  const { isLoading, refetch: refetchBallot } = useBallot(ballotId);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const search = useTextField("");
  const debouncedSearch = useDebounce(search.value, 500);
  const {
    data,
    status: moviesStatus,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useMovies(debouncedSearch);
  const { mutateAsync: nominateMovie } = useNominateMovie(ballotId);
  const { data: nominated, refetch: refetchNominated } = useNominatedMovies(
    ballotId
  );
  const { mutateAsync: deleteBallot } = useDeleteBallot(ballotId);
  const [status, setStatus] = useState(Status.LOADING);
  const [listening, setListening] = useState(false);
  const history = useHistory();

  const movies = useMemo(
    () =>
      data?.pages
        .map((page) => page.movies)
        .flat()
        .filter((movie) => !!movie) || [],
    [data]
  );

  useEffect(() => {
    if (!listening && ballotId) {
      const events = new EventSource(
        EVENT_SOURCE_URL + "/api/ballots/" + ballotId + "/subscribe"
      );
      events.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.event) {
          if (data.event === "NOMINATIONS_UPDATED") {
            refetchNominated();
          } else if (data.event === "BALLOT_DELETED") {
            enqueueSnackbar(
              "This ballot has been deleted. Redirecting you to the home page.",
              { variant: "info" }
            );
            setTimeout(() => history.push("/"), 3000);
          }
        }
      };
      setListening(true);
    }
  }, [ballotId, history, enqueueSnackbar, listening, refetchNominated]);

  useEffect(() => {
    (async function () {
      if (ballotId) {
        if (await checkExists(ballotId)) {
          setStatus(Status.EXISTS);
        } else {
          setStatus(Status.DOES_NOT_EXIST);
        }
      }
    })();
  }, [ballotId]);

  async function nominate(movie) {
    if (nominated?.length >= 5) {
      enqueueSnackbar("You've already nominated 5 movies.", {
        variant: "warning",
      });
      return;
    }
    try {
      await nominateMovie({
        movie: movie,
        action: "nominate",
      });
    } catch (error) {
      enqueueSnackbar(
        "We ran into an error on our end. Please try again later or contact support.",
        {
          variant: "error",
        }
      );
    } finally {
      refetchBallot();
    }
  }

  async function withdraw(movie) {
    try {
      await nominateMovie({
        movie,
        action: "withdraw",
      });
    } catch (error) {
    } finally {
      refetchBallot();
    }
  }

  async function onDeleteBallot() {
    try {
      await deleteBallot();
    } catch (error) {
      enqueueSnackbar(
        "We ran into an error on our end. Please try again later or contact support.",
        {
          variant: "error",
        }
      );
    }
  }

  if (status === Status.LOADING || isLoading) {
    return <div className={classes.root}></div>;
  } else if (status === Status.DOES_NOT_EXIST) {
    return <DoesNotExist />;
  }
  return (
    <div style={{ overflowX: "hidden" }}>
      <div className={classes.root}>
        <DarkModeSwitch />
        <div className={classes.container}>
          <Typography variant="h1">
            <CopyToClipboard
              text={`${ORIGIN}/ballot/${ballotId}`}
              onCopy={() => {
                enqueueSnackbar(`URL copied to clipboard.`, {
                  variant: "success",
                });
                setTimeout(closeSnackbar, 5000);
              }}
            >
              <span className={classes.link}>
                Ballot: {ballotId} <LinkIcon />
              </span>
            </CopyToClipboard>
          </Typography>
          <QRCode />
          <Button
            onClick={onDeleteBallot}
            variant="contained"
            className={classes.deleteBtn}
          >
            Delete Ballot
          </Button>

          <div>
            <Typography variant="h1">Nominations</Typography>
            {nominated &&
              (nominated.length === 5 ? (
                <div className={classes.completeBanner}>
                  <p>Congratulations, you've nominated 5 movies!</p>
                </div>
              ) : (
                <p>
                  You've nominated {nominated.length} movie
                  {nominated.length !== 1 && "s"}, {5 - nominated.length} more
                  to go!
                </p>
              ))}
            <AnimateSharedLayout>
              <AnimatePresence>
                {nominated?.map((movie, index) => {
                  return (
                    <MovieCard
                      imdbID={movie.imdbID}
                      key={movie.imdbID}
                      title={movie.Title}
                      poster={movie.Poster}
                      year={movie.Year}
                      action={
                        <Button
                          onClick={() => withdraw(movie)}
                          variant="contained"
                          color="secondary"
                        >
                          Remove
                        </Button>
                      }
                    />
                  );
                })}
              </AnimatePresence>
            </AnimateSharedLayout>
          </div>
          <Typography variant="h1">Search</Typography>
          <input
            className={classes.search}
            value={search.value}
            onChange={search.onChange}
            placeholder="I'm looking for ..."
          />
          <div>
            {moviesStatus !== "idle" && moviesStatus === "loading" ? (
              <p>Loading</p>
            ) : !!debouncedSearch && movies.length === 0 ? (
              <p>No Results</p>
            ) : (
              ""
            )}
            <AnimatePresence>
              {movies?.map((movie, index) => (
                <MovieCard
                  key={index}
                  imdbID={movie.imdbID}
                  title={movie.Title}
                  year={movie.Year}
                  poster={movie.Poster}
                  action={
                    <Button
                      disabled={nominated
                        ?.map((x) => x.imdbID)
                        .includes(movie.imdbID)}
                      variant="contained"
                      color="primary"
                      onClick={() => nominate(movie)}
                    >
                      Nominate
                    </Button>
                  }
                />
              ))}
            </AnimatePresence>
            <AnimatePresence>
              {hasNextPage && !isFetchingNextPage && (
                <motion.div
                  initial={{ opacity: 0, y: 100, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 100, scale: 0.5 }}
                  transition={{ delay: 0 }}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={fetchNextPage}
                    disabled={!hasNextPage || isFetchingNextPage}
                  >
                    Load More
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
