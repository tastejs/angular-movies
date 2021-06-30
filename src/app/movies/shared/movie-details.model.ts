import { MovieGenreModel } from './movie-genre.model';

export interface MovieDetailsModel {
    adult: boolean;
    backdrop_path: string;
    belongs_to_collection: any;
    budget: number;
    genres: MovieGenreModel[];
    homepage: string;
    id: number;
    imdb_id: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: CompaniesModel[];
    production_countries: CountriesModel[];
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: SpokenModel[];
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

interface CompaniesModel {
    name: string;
    id: number;
}

interface CountriesModel {
    iso_3166_1: string;
    name: string;
}

interface SpokenModel {
    iso_639_1: string;
    name: string;
}
