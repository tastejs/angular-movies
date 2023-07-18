import {TMDBMovieGenreModel} from './movie-genre.model';

export interface TMDBMovieDetailsModel {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: unknown;
  budget: number;
  genres: TMDBMovieGenreModel[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: TMDBCompaniesModel[];
  production_countries: TMDBCountriesModel[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: TMDBSpokenModel[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  videos?: { results?: TMDBTrailerVideoModel[] };
  vote_average: number;
  vote_count: number;
}

interface TMDBCompaniesModel {
  name: string;
  id: number;
}

interface TMDBCountriesModel {
  iso_3166_1: string;
  name: string;
}

interface TMDBSpokenModel {
  iso_639_1: string;
  name: string;
  english_name: string;
}

interface TMDBTrailerVideoModel {
  id: string;
  key: string;
  name: string;
  official: true;
  site: 'YouTube';
  type: 'Trailer';
}
