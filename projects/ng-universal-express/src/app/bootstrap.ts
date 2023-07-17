import bootstrapMovies from 'angular-movies'
import 'zone.js';
import {appConfig} from "./app.config";

const bootstrap = () => bootstrapMovies(appConfig);

export default bootstrap;
