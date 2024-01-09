import React from 'react';

import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[];
  onDelete: (imdbId: string) => void;
};

export const MoviesList: React.FC<Props> = ({ movies, onDelete }) => (
  <div className="movies">
    {movies.map(movie => (
      <MovieCard
        key={movie.imdbId}
        movie={movie}
        onDelete={onDelete}
      />
    ))}
  </div>
);
