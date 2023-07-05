import bootstrapMovies from '../../../movies/src/index'
import 'zone.js';
import {appConfig} from "./app.config";

const bootstrap = () => bootstrapMovies(appConfig);

export default bootstrap;
