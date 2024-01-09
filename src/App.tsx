import { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const storedMovies = localStorage.getItem('movies');

    if (storedMovies) {
      setMovies(JSON.parse(storedMovies));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('movies', JSON.stringify(movies));
  }, [movies]);

  const onAdd = (newObject: Movie | null) => {
    if (newObject !== null && movies.every((movie) => movie.imdbId
      !== newObject.imdbId)) {
      // Check if a movie with the same imdbId already exists in the movies list
      setMovies([...movies, newObject]);
    }
  };

  const onDelete = (imdbId: string | undefined) => {
    const updatedMovies = movies.filter((movie) => movie.imdbId !== imdbId);

    setMovies(updatedMovies);
  };

  return (
    <>
      <div className="page">
        <div className="page-content">
          <h1 className="page-title">My Movies </h1>
          <MoviesList movies={movies} onDelete={onDelete} />

        </div>

        <div className="sidebar">
          <FindMovie
            onAdd={onAdd}
          />
        </div>
      </div>
    </>
  );
};
