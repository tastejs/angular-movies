import {TMDBMovieGenreModel} from './movie-genre.model';

export interface TMDBMovieModel {
    poster_path: string;
    adult: boolean;
    overview: string;
    release_date: string;
    genre_ids: TMDBMovieGenreModel;
    id: number;
    original_title: string;
    original_language: string;
    title: string;
    backdrop_path: string;
    popularity: number;
    vote_count: number;
    video: boolean;
    vote_average: number;
}
