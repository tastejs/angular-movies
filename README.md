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
| main.ed21e826cb0e7725.js           | 349.63 KB |
| styles.587a48cd73a27b6a.css           | 6.14 KB |
| runtime.bec732e7f6eba60e.js           | 4.04 KB |
  | **Initial Total** | **359.81 KB** |
  | Names             |       Size |
| app_pages_movie-detail-page_movie-detail-page_component_ts.62d292586c19dd9e.js           | 15.58 KB |
| app_pages_person-detail-page_person-detail-page_component_ts.76bfee65006dd5e1.js           | 11.05 KB |
| app_pages_account-feature_list-detail-page_list-items-edit_list-items-edi-13eb42.9beb6965e5b3c14a.js           | 6.75 KB |
| common.621f6c63c31f0f8f.js           | 5.68 KB |
| app_pages_account-feature_list-create-page_list-create-page_component_ts.92ec77577723a03c.js           | 5.23 KB |
| app_app-shell_account-menu_account-menu_component_lazy_ts.5c66953af9b58865.js           | 4.65 KB |
| app_pages_account-feature_account-list-page_account-list-page_component_ts.b608cc4d7ef7b629.js           | 3.78 KB |
| app_pages_account-feature_list-detail-page_list-remove_list-remove_component_ts.a65e20ddb4cb67b3.js           | 3.1 KB |
| app_pages_account-feature_list-detail-page_list-detail-page_component_ts.e926a60f713ea600.js           | 2.81 KB |
| app_pages_account-feature_list-detail-page_list-image_list-image_component_ts.56dfb26d43616416.js           | 2.55 KB |
| app_pages_not-found-page_not-found-page_component_ts.db2be1846fc8a777.js           | 1.65 KB |
| app_pages_account-feature_list-detail-page_list-detail-page_routes_ts.d7e2c90a1f032c1b.js           | 1.57 KB |
| app_pages_account-feature_account-featuer-page_routes_ts.71de5f44cacc5fac.js           | 841 Bytes |
| app_pages_account-feature_list-detail-page_list-movies_list-movies_component_ts.cb400ff482b3ca53.js           | 641 Bytes |
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
