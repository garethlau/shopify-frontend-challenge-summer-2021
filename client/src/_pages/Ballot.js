import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import useBallot from "../_queries/useBallot";
import axios from "axios";
import useMovies from "../_queries/useMovies";
import useTextField from "../_hooks/useTextField";
import useDebounce from "../_hooks/useDebounce";
import Button from "../_components/Button";
import useNominateMovie from "../_mutations/useNominateMovie";
import MovieCard from "../_components/MovieCard";
import { AnimatePresence } from "framer-motion";
import { useSnackbar } from "notistack";
import { motion } from "framer-motion";
import QRCode from "../_components/QRCode";
import LinkIcon from "@material-ui/icons/Link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import DarkModeSwitch from "../_components/DarkModeSwitch";
import useNominatedMovies from "../_queries/useNominatedMovies";
import checkExists from "../_utils/checkExists";
import DoesNotExist from "../_components/DoesNotExist";
import Typography from "@material-ui/core/Typography";

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

export default function Nominate() {
  const { ballotId } = useParams();
  const classes = useStyles();
  const { data: ballot, isLoading, refetch: refetchBallot } = useBallot(
    ballotId
  );
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const search = useTextField("");
  const debouncedSearch = useDebounce(search.value, 500);
  const {
    data: movies,
    status: moviesStatus,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useMovies(debouncedSearch);
  const { mutateAsync: nominateMovie } = useNominateMovie(ballotId);
  const { data: nominated, refetch: refetchNominated } = useNominatedMovies(
    ballotId
  );
  const [status, setStatus] = useState(Status.LOADING);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!listening && ballotId) {
      const events = new EventSource(
        EVENT_SOURCE_URL + "/api/ballot/" + ballotId + "/subscribe"
      );
      events.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.event) {
          if (data.event === "NOMINATIONS_UPDATED") {
            refetchNominated();
          } else if (data.event === "BALLOT_DELETED") {
          }
        }
      };
      setListening(true);
    }
  }, [ballotId]);

  useEffect(async () => {
    if (ballotId) {
      if (await checkExists(ballotId)) {
        setStatus(Status.EXISTS);
      } else {
        setStatus(Status.DOES_NOT_EXIST);
      }
    }
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

            <AnimatePresence>
              {nominated?.map((movie, index) => {
                return (
                  <MovieCard
                    key={index}
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
          </div>
          <Typography variant="h1">Search</Typography>
          <input
            className={classes.search}
            value={search.value}
            onChange={search.onChange}
            placeholder="I'm looking for ..."
          />
          <div>
            {debouncedSearch && movies?.length === 0 && <p>No results.</p>}
            {moviesStatus !== "idle" && moviesStatus === "loading" && (
              <p>Loading</p>
            )}
            <AnimatePresence>
              {movies?.pages?.map((page, pageNumber) => (
                <React.Fragment key={pageNumber}>
                  {page.movies?.map((movie, index) => (
                    <MovieCard
                      key={index}
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
                </React.Fragment>
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
