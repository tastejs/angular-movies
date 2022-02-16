import { TMDBMovieModel } from './movie.model';

export interface TMDBListCreateUpdateParams {
  id?: number;
  name?: string;
  description?: string;
  iso_639_1?: string;
  private?: boolean;
  backdrop_path?: string;
}

export interface TMDBAddMovieToListParams {
  id: number;
  items: { media_type: string; media_id: number }[];
}

export interface TMDBAccountList {
  iso_639_1?: string;
  id?: number;
  featured?: number;
  description?: string;
  revenue?: string;
  public?: number;
  name?: string;
  updated_at?: string;
  created_at?: string;
  sort_by?: number;
  backdrop_path?: string;
  runtime?: number;
  average_rating?: number;
  iso_3166_1?: string;
  adult?: number;
  number_of_items?: number;
  poster_path?: string;
}

export interface TMDBListModel {
  poster_path?: string | null;
  id?: number;
  backdrop_path?: string | null;
  total_results?: number;
  public?: boolean;
  revenue?: string;
  page?: number;
  results?: TMDBMovieModel[];
  iso_639_1?: string;
  total_pages?: number;
  description?: string;
  created_by: {
    gravatar_hash: string;
    name: string;
    username: string;
  };
  iso_3166_1?: string;
  average_rating?: number;
  runtime?: number;
  name?: string;
  comments?: Record<string, unknown>;
  private?: number | boolean;
}
