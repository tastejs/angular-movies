export interface TMDBMovieCreditsModel {
  id: number;
  cast: TMDBMovieCastModel[];
  crew: TMDBMovieCrewModel[];
}

export interface TMDBMovieCrewModel {
  credit_id: number;
  department: string;
  gender: number;
  id: number;
  job: string;
  name: string;
  profile_path: string;
}

export interface TMDBMovieCastModel {
  cast_id: number;
  character: string;
  credit_id: string;
  gender: number;
  id: number;
  name: string;
  order: number;
  profile_path: string;
}
