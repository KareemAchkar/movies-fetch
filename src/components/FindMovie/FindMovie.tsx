/* eslint-disable quote-props */
import React, { ChangeEvent, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  onAdd: (newObj: Movie | null) => void
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [newMovie, setMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const onQuery = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const onError = () => {
    setHasError(true);
  };

  const onLoading = () => {
    setIsLoading(true);
  };

  const onAddList = () => {
    setIsAdded(true);
    setTimeout(() => {
      onAdd(newMovie);
      setMovie(null);

      setIsLoading(false);
      setIsAdded(false);
    }, 1300);
  };

  const LoadMovie = async () => {
    onLoading();
    try {
      const loadedMovie = await getMovie(query);
      const movieError = loadedMovie as ResponseError;

      if (movieError.Response === 'False') {
        onError();
      } else {
        const newRes = loadedMovie as MovieData;
        const addedMovie: Movie = {
          title: query,
          description: newRes.Plot,
          imdbId: newRes.imdbID,
          imgUrl: newRes.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : newRes.Poster,
          imdbUrl: `https://www.imdb.com/title/${newRes.imdbID}`,
        };

        setMovie(addedMovie);
      }
    } catch (error) {
      // console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          LoadMovie();
          setQuery('');
          setHasError(false);
        }}
        className="find-movie"
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            <span className="movie-find-title">Movie title</span>
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input"
              value={query}
              onChange={onQuery}
            />
          </div>
          {hasError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-dark ${!query && 'is-disabled'} ${isLoading && 'is-loading'}`}
              disabled={!query || isLoading}
            >
              Find a movie
            </button>
          </div>
          {newMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className={cn('button is-primary', { 'isAdded': isAdded })}
                onClick={onAddList}
                style={{ opacity: isAdded ? 0.6 : 1 }}
                disabled={isAdded}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        {newMovie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard
              movie={newMovie}
              onDelete={() => { }}
            />
          </>
        )}
      </div>
    </>
  );
};
