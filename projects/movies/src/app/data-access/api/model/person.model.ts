export interface TMDBPersonModel {
  adult: boolean;
  also_known_as: {
    name: string;
  };
  biography: string;
  birthday: string;
  deathday: string;
  gender: number;
  homepage: string;
  id: number;
  imdb_id: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
}
