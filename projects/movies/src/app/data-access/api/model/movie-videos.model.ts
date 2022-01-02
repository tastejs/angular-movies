export interface TMDBMovieVideosModel {
    id: number;
    results: TMDBVideoResults[];
}

interface TMDBVideoResults {
    id: string;
    iso_639_1: string;
    iso_3166_1: string;
    key: string;
    name: string;
    site: string;
    size: number;
    type: string;
}
