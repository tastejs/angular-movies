# angular-movies

This is a Movies App built using [Angular](https://angular.io) and [RxAngular](https://github.com/rx-angular/rx-angular).  
As data source the [The Movie Database (TMDB)](https://www.themoviedb.org/) API is used.  

[![angular-and-rx-angular](https://user-images.githubusercontent.com/10064416/154189195-c32cbdec-b061-46a5-8590-a9e3d8dc050a.png)](https://www.rx-angular.io/)


## Demo

A [live deployment](https://angular-movies-a12d3.web.app/list/category/popular) of this app is available to try it out.


## Performance Optimizations 


[![angular-movies--after-before](https://user-images.githubusercontent.com/10064416/155904454-f70b5bb5-6591-497a-9d21-dca0e2940566.gif)](https://www.webpagetest.org/video/compare.php?tests=220216_BiDcPP_CVM,220216_AiDcBN_ETK)


For now you can search the codebase for "Perf Tip" later on there will be propper documentation here.


[Measures before optimization](https://lighthouse-metrics.com/checks/9ddeb46e-2c28-453c-b719-cf080a01b13c)
[![angular-movies-before_michael-hladky](https://user-images.githubusercontent.com/10064416/137785051-1cf9f63a-e803-4d92-a952-c327b7628530.PNG)](https://lighthouse-metrics.com/checks/9ddeb46e-2c28-453c-b719-cf080a01b13c)


[Measures after optimization](https://lighthouse-metrics.com/checks/6a888a17-b17b-46a6-abc9-e605b73a530c/runs/503701ad-36aa-43ad-8de3-cb40e775c770)
![angular-movies-after-optimization_michael-hladky](https://user-images.githubusercontent.com/10064416/146446241-ad9eeed4-b0a4-44a2-a88e-4ea7c97e1acf.PNG)


**Bundle Stats**







































<!-- bundle-stats-start -->
| Names             |       Size |
| ---               | ---        |
| main.299800b59ac22135.js           | 348.15 KB |
| styles.587a48cd73a27b6a.css           | 6.14 KB |
| runtime.add647e95cbfbc8c.js           | 4.04 KB |
  | **Initial Total** | **358.34 KB** |
  | Names             |       Size |
| app_pages_movie-detail-page_movie-detail-page_component_ts.601065b23e157749.js           | 15.6 KB |
| app_pages_person-detail-page_person-detail-page_component_ts.77bd1c323de08677.js           | 11.1 KB |
| app_pages_account-feature_list-detail-page_list-items-edit_list-items-edi-13eb42.a44a677f9c8d6c94.js           | 6.8 KB |
| common.f2a4c0c7f8c5e622.js           | 5.78 KB |
| app_pages_account-feature_list-create-page_list-create-page_component_ts.5481cda0e59d6cd6.js           | 5.28 KB |
| app_app-shell_account-menu_account-menu_component_lazy_ts.5ce7154cb6cd7726.js           | 4.74 KB |
| app_pages_account-feature_account-list-page_account-list-page_component_ts.4e15c5ff835a4f2d.js           | 3.88 KB |
| app_pages_account-feature_list-detail-page_list-remove_list-remove_component_ts.33c2cc8d85f99493.js           | 3.12 KB |
| app_pages_account-feature_list-detail-page_list-detail-page_component_ts.f785b952611349bd.js           | 2.83 KB |
| app_pages_account-feature_list-detail-page_list-image_list-image_component_ts.ae6d420b79be8b1d.js           | 2.58 KB |
| app_pages_not-found-page_not-found-page_component_ts.5a8126d84c1a66df.js           | 1.68 KB |
| app_pages_account-feature_list-detail-page_list-detail-page_routes_ts.d7e2c90a1f032c1b.js           | 1.57 KB |
| app_pages_account-feature_account-featuer-page_routes_ts.71de5f44cacc5fac.js           | 841 Bytes |
| app_pages_account-feature_list-detail-page_list-movies_list-movies_component_ts.e53b2197270a61db.js           | 666 Bytes |
<!-- bundle-stats-end -->



## Comparison to next and nuxt

- [angular](https://angular-movies-a12d3.web.app/list/category/popular)
- [next](https://movies.zaps.dev/?category=Popular&page=1)
- [nuxt](https://movies.jason.codes/movie/category/popular)

[![angular-vs-next-vs-nuxt](https://user-images.githubusercontent.com/10064416/155904543-333e1c25-7c01-470a-b399-40eee4c9d02c.gif)](https://www.webpagetest.org/video/compare.php?tests=220216_AiDcBJ_EAA,220216_BiDcER_CDY,220216_BiDc68_CDZ)

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

Measures:
* Bundle sice listed fron dist
* Comparison videos with [webpagetest](https://www.webpagetest.org)
* Lighthoure reports with [lighthouse-metrics](https://lighthouse-metrics.com)
* User-flows created with [@push-based/user-flow](https://www.npmjs.com/package/@push-based/user-flow)

## Authors

- [push-based.io](https://push-based.io)
- [Michael Hladky](https://github.com/BioPhoton)
- [Kirill Karnaukhov](https://github.com/Karnaukhov-kh)
- [Julian Jandl](https://github.com/HoebbelsB)
- [Vojtech Mašek](https://github.com/vmasek)


Based on the original `angular-movies` foundation by [@clamarque](https://github.com/clamarque/angular-movies).
  
## License

[MIT](https://choosealicense.com/licenses/mit/)
