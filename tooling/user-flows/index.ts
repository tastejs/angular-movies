import {report as coldWarmNavigationMainList} from "./cold-warm-navigation--main-list";
import {report as coldWarmNavigationMovieDetail} from "./cold-warm-navigation--movie-detail";
import {report as categoryNavigation} from "./category-to-category-cold-navigation";

// const baseUrl = 'http://localhost:4200/';
const baseUrl = 'https://angular-movies-a12d3.web.app/';

(async () => {
  await coldWarmNavigationMainList({baseUrl});
  await coldWarmNavigationMovieDetail({baseUrl, id: 566525});
  await categoryNavigation({baseUrl});
})()
