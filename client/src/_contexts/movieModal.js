import { createContext, useState } from "react";
import MovieModal from "../_components/MovieModal";

export const MovieModalContext = createContext();

export function MovieModalProvider({ children }) {
  const [imdbID, setImdbID] = useState();
  const [isOpen, setIsOpen] = useState(false);

  function open(id) {
    setIsOpen(true);
    setImdbID(id);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <MovieModalContext.Provider
      value={{
        open,
        close,
        isOpen,
        imdbID,
      }}
    >
      <MovieModal open={open} close={close} isOpen={isOpen} imdbID={imdbID} />
      {children}
    </MovieModalContext.Provider>
  );
}
