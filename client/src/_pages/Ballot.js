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

const ORIGIN = process.env.REACT_APP_ORIGIN || "localhost:3000";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    minHeight: "100vh",
    backgroundColor: theme.colors.darkShade,
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
    color: "white",
  },
  link: {
    "&:hover": {
      cursor: "pointer",
      borderBottom: "3px solid",
      transition: "ease 0.3s",
    },
  },
  ballot: {
    // backgroundColor: theme.colors.lightShade,
  },
  nomineeList: {
    backgroundColor: theme.colors.lightShade,
    padding: "20px",
  },
  movieCard: {
    backgroundColor: "rgb(43, 43, 50)",
    borderRadius: "10px",
    display: "grid",
    gridTemplateColumns: "100px auto 150px",
    margin: "20px 0",
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

export default function Nominate() {
  const { ballotId } = useParams();
  const classes = useStyles();
  const { data: ballot, isLoading, refetch: refetchBallot } = useBallot(
    ballotId
  );
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
  const [nominated, setNominated] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (ballot?.nominations?.length === 0) {
      setNominated([]);
    } else if (ballot?.nominations?.length > 0) {
      let promises = ballot.nominations.map(
        (imdbID) =>
          new Promise((resolve, reject) => {
            axios
              .get("/api/movie/" + imdbID)
              .then((response) => {
                resolve(response.data.movie);
              })
              .catch((error) => {
                reject(error);
              });
          })
      );
      Promise.all(promises).then((values) => {
        setNominated(values);
      });
    }
  }, [ballot]);

  return (
    <div style={{ overflowX: "hidden" }}>
      <div className={classes.root}>
        <div className={classes.container}>
          <h1>
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
          </h1>
          <QRCode />

          <div>
            {isLoading ? (
              "Loading"
            ) : (
              <div className={classes.ballot}>
                <h1>Nominations</h1>
                {nominated.length === 5 ? (
                  <div className={classes.completeBanner}>
                    <p>Congratulations, you've nominated 5 movies!</p>
                  </div>
                ) : (
                  <p>
                    You've nominated {nominated.length} movie
                    {nominated.length !== 1 && "s"}, {5 - nominated.length} more
                    to go!
                  </p>
                )}
                {nominated.map((movie, index) => {
                  return (
                    <MovieCard
                      key={index}
                      title={movie.Title}
                      poster={movie.Poster}
                      year={movie.Year}
                      action={
                        <Button
                          onClick={async () => {
                            await nominateMovie({
                              imdbID: movie.imdbID,
                              action: "withdraw",
                            });
                            refetchBallot();
                          }}
                          variant="contained"
                          color="secondary"
                        >
                          Remove
                        </Button>
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>

          <h1>Search</h1>
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
                            .map((x) => x.imdbID)
                            .includes(movie.imdbID)}
                          variant="contained"
                          color="primary"
                          onClick={async () => {
                            if (nominated.length < 5) {
                              await nominateMovie({
                                imdbID: movie.imdbID,
                                action: "nominate",
                              });
                              refetchBallot();
                            } else {
                              enqueueSnackbar(
                                "You've already nominated 5 movies.",
                                { variant: "error" }
                              );
                            }
                          }}
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
