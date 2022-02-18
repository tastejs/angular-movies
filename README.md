# angular-movies

This is a Movies App built using [Angular](https://angular.io) and [RxAngular](https://github.com/rx-angular/rx-angular).  
As data source the [The Movie Database (TMDB)](https://www.themoviedb.org/) API is used. 

[![angular-and-rx-angular](https://user-images.githubusercontent.com/10064416/154189195-c32cbdec-b061-46a5-8590-a9e3d8dc050a.png)](https://www.rx-angular.io/)


## Demo

A [live deployment](https://angular-movies-a12d3.web.app/list/category/popular) of this app is available to try it out.


## Performance Optimizations 

[![before-vs-after](https://www.webpagetest.org/video/video.php?tests=220216_BiDcPP_CVM,220216_AiDcBN_ETK&bg=ffffff&text=222222&end=visual&format=gif)](https://www.webpagetest.org/video/compare.php?tests=220216_BiDcPP_CVM,220216_AiDcBN_ETK)


For now you can search the codebase for "Perf Tip" later on there will be propper documentation here.


[Measures before optimization](https://lighthouse-metrics.com/checks/9ddeb46e-2c28-453c-b719-cf080a01b13c)
[![angular-movies-before_michael-hladky](https://user-images.githubusercontent.com/10064416/137785051-1cf9f63a-e803-4d92-a952-c327b7628530.PNG)](https://lighthouse-metrics.com/checks/9ddeb46e-2c28-453c-b719-cf080a01b13c)


[Measures after optimization](https://lighthouse-metrics.com/checks/6a888a17-b17b-46a6-abc9-e605b73a530c/runs/503701ad-36aa-43ad-8de3-cb40e775c770)
![angular-movies-after-optimization_michael-hladky](https://user-images.githubusercontent.com/10064416/146446241-ad9eeed4-b0a4-44a2-a88e-4ea7c97e1acf.PNG)


<!-- bundle-stats-start -->
| Names             |       Size |
| ---               | ---        |
| main.5de80b3a332abb7b.js           | 328.77 KB |
| styles.cc65c6709a6ae634.css           | 5.37 KB |
| runtime.cf36f3597ba77fda.js           | 3.73 KB |
  | **Initial Total** | **337.87 KB** |
  | Names             |       Size |
| projects_movies_src_app_pages_movie-detail-page_movie-detail-page_module_ts.5013e361efd935b0.js           | 13.78 KB |
| projects_movies_src_app_pages_not-found-page_not-found-page_module_ts.fae776b5c61c1a24.js           | 12.31 KB |
| common.ed8efc2ecffef487.js           | 10.87 KB |
| projects_movies_src_app_pages_person-detail-page_person-detail-page_module_ts.286c0760ad02a01d.js           | 8.09 KB |
| projects_movies_src_app_pages_account-feature_list-detail-page_list-items-edit_list-items-edi-393246.38506ef7d9a63d65.js           | 6.62 KB |
| projects_movies_src_app_pages_account-feature_account-list-page_account-list-page_module_ts.d8147419d0167752.js           | 4.9 KB |
| projects_movies_src_app_app-shell_account-menu_account-menu_component_lazy_ts.94c10117a50f0a0a.js           | 4.25 KB |
| projects_movies_src_app_pages_account-feature_list-detail-page_list-detail-page_module_ts.ecc28661631e9fa9.js           | 3.54 KB |
| projects_movies_src_app_pages_account-feature_list-detail-page_list-image_list-image_module_ts.5198cd8e27e911ed.js           | 3.47 KB |
| projects_movies_src_app_pages_account-feature_list-detail-page_list-remove_list-remove_module_ts.4b1a50ea9698f35f.js           | 3.43 KB |
| projects_movies_src_app_pages_account-feature_list-detail-page_list-movies_list-movies_module_ts.9bcc5b52f48d86cf.js           | 837 Bytes |
<!-- bundle-stats-end -->

## Comparison to next and nuxt

- [angular](https://angular-movies-a12d3.web.app/list/category/popular)
- [next](https://movies.zaps.dev/?category=Popular&page=1)
- [nuxt](https://movies.jason.codes/movie/category/popular)

[![angular-vs-next-vs-nuxt](https://www.webpagetest.org/video/video.php?tests=220216_AiDcBJ_EAA,220216_BiDcER_CDY,220216_BiDc68_CDZ&bg=ffffff&text=222222&end=visual&format=gif)](https://www.webpagetest.org/video/compare.php?tests=220216_AiDcBJ_EAA,220216_BiDcER_CDY,220216_BiDc68_CDZ)

## Contributing

Contributions are always welcome! 

For large changes, please file an issue to discuss your proposed changes with us before working on a PR :)

## Installation 

Clone and install the dependencies for `angular-movies` locally:

```bash 
  git clone https://github.com/tastejs/angular-movies.git
  cd angular-movies 
  npm install
```

## Quick setup

1. Take a copy of `src/environments/environment.local.example.ts` and re-name to `src/environments/environment.prod.ts` 
2. Get your TMDb API key
3. Get your TMDB API read access token
4. Enter the details into the `src/environments/environment.prod.ts` file
    
## Running locally

* `npm run build:dev`: dev build
* `npm run build:prod`: production build
* `npm run build:prod:ssr`: production build for SSR
* `npm run start`: serve the project locally for development
* `npm run start:ssr:dev`: serve the project locally SSR for development
* `npm run start:ssr:prod`: serve the project locally SSR for production
* `npm run analyze:bundlesize`: bundle size analysis 

## Tech Stack

Built with: 

* [Angular](https://angular.io)
* [rx-angular](https://github.com/rx-angular/rx-angular)

[![angular-and-rx-angular](https://user-images.githubusercontent.com/10064416/154189195-c32cbdec-b061-46a5-8590-a9e3d8dc050a.png)](https://www.rx-angular.io/)
  
## Authors

- [push-based.io](https://push-based.io)
- [Michael Hladky](https://github.com/BioPhoton)
- [Kirill Karnaukhov](https://github.com/Karnaukhov-kh)
- [Julian Jandl](https://github.com/HoebbelsB)
- [Vojtech Mašek](https://github.com/vmasek)


Based on the original `angular-movies` foundation by [@clamarque](https://github.com/clamarque/angular-movies).
  
## License

[MIT](https://choosealicense.com/licenses/mit/)
