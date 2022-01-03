export interface TMDBConfigurationModel {
  change_keys: string[];
  images: {
    backdrop_sizes: string[];
  };
  base_url: string;
  logo_sizes: string[];
  poster_sizes: string[];
  profile_sizes: string[];
  secure_base_url: string[];
  still_sizes: string[];
}
