# angular-movies

This is a Movies App built using [Angular](https://angular.io)
and [RxAngular](https://github.com/rx-angular/rx-angular).  
As data source the [The Movie Database (TMDB)](https://www.themoviedb.org/) API is used.

[![angular-and-rx-angular](https://user-images.githubusercontent.com/10064416/154189195-c32cbdec-b061-46a5-8590-a9e3d8dc050a.png)](https://www.rx-angular.io/)

## [Demo](https://angular-movies-a12d3.web.app/list/category/popular)

A [live deployment](https://angular-movies-a12d3.web.app/list/category/popular) of this app is available to try it out.

## Performance Optimizations

[![angular-movies--after-before](https://user-images.githubusercontent.com/10064416/155904454-f70b5bb5-6591-497a-9d21-dca0e2940566.gif)](https://www.webpagetest.org/video/compare.php?tests=220216_BiDcPP_CVM,220216_AiDcBN_ETK)

For now you can search the codebase for "Perf Tip" later on there will be propper documentation here.

[Measures before optimization](https://lighthouse-metrics.com/checks/9ddeb46e-2c28-453c-b719-cf080a01b13c)
[![angular-movies-before_michael-hladky](https://user-images.githubusercontent.com/10064416/137785051-1cf9f63a-e803-4d92-a952-c327b7628530.PNG)](https://lighthouse-metrics.com/checks/9ddeb46e-2c28-453c-b719-cf080a01b13c)

[Measures after optimization](https://lighthouse-metrics.com/checks/6a888a17-b17b-46a6-abc9-e605b73a530c/runs/503701ad-36aa-43ad-8de3-cb40e775c770)
![angular-movies-after-optimization_michael-hladky](https://user-images.githubusercontent.com/10064416/146446241-ad9eeed4-b0a4-44a2-a88e-4ea7c97e1acf.PNG)

### Bundle Stats


<!-- bundle-stats-start -->
| Names             |       Size |
| ---               | ---        |
| chunk-H73X5IJZ.js           | 171.91 KB |
| chunk-J5RJBBBA.js           | 97.67 KB |
| main-HAHZT3VR.js           | 29.36 KB |
| chunk-26THTVGX.js           | 23.04 KB |
| chunk-MFJP3XQD.js           | 13.03 KB |
| chunk-DD4274WW.js           | 11.24 KB |
| chunk-UJXKG7ZY.js           | 5.84 KB |
| styles-6J6M4RLR.css           | 5.56 KB |
| chunk-EVI72JMS.js           | 4.47 KB |
| chunk-5U5GISVB.js           | 3.59 KB |
| chunk-F6TX2SNN.js           | 3.48 KB |
| chunk-XEGPBJW5.js           | 3.36 KB |
| chunk-WWKH7ZTZ.js           | 2.88 KB |
| chunk-CVADAK7V.js           | 2.7 KB |
| chunk-BWRSEVT6.js           | 2.25 KB |
| chunk-A6OUD7GF.js           | 1.89 KB |
| chunk-ENKFPH2E.js           | 1.49 KB |
| chunk-6WGLRJL2.js           | 1.44 KB |
| chunk-S43YYWE6.js           | 1.35 KB |
| chunk-3BVTSY3H.js           | 1.28 KB |
| chunk-VNMZ5JEE.js           | 1.22 KB |
| chunk-TERIXCX3.js           | 1.09 KB |
| chunk-IPYUPOU3.js           | 1.08 KB |
| chunk-IS6BG5PM.js           | 981 Bytes |
| chunk-LHAROUAO.js           | 708 Bytes |
| chunk-UAQLGPOG.js           | 690 Bytes |
| chunk-HMA6A7BH.js           | 675 Bytes |
| chunk-7CGTOI24.js           | 618 Bytes |
| chunk-SRLHFTA6.js           | 559 Bytes |
| chunk-4EXWTXAN.js           | 380 Bytes |
| chunk-PNQWYDWA.js           | 310 Bytes |
| chunk-UA2OID3I.js           | 300 Bytes |
| chunk-53TECYDK.js           | 300 Bytes |
| chunk-YPVBW5JE.js           | 197 Bytes |
| chunk-6SM3TQVG.js           | 153 Bytes |
| chunk-E2EYHV3P.js           | 136 Bytes |
| chunk-QBRSGN6K.js           | 125 Bytes |
| chunk-K3RHTP23.js           | 96 Bytes |
| chunk-LFUTSNCE.js           | 37 Bytes |
  | **Initial Total** | **397.31 KB** |
  | Names             |       Size |
| movie-detail-page.component           | 15.7 KB |
| person-detail-page.component           | 11.89 KB |
| list-items-edit.component           | 7.07 KB |
| list-create-page.component           | 6.19 KB |
| movie-list-page.component           | 6.08 KB |
| account-menu.component           | 4.99 KB |
| account-list-page.component           | 3.35 KB |
| list-detail-page.component           | 3.15 KB |
| list-remove.component           | 3.07 KB |
| list-image.component           | 3 KB |
| not-found-page.component           | 1.68 KB |
| list-movies.component           | 1.05 KB |
| list-detail-page.routes           | 610 Bytes |
| account-feature-page.routes           | 550 Bytes |
| movie-list.component           | 460 Bytes |
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

1. Take a copy of `src/environments/environment.local.example.ts` and re-name
   to `src/environments/environment.production.ts`
2. Get your TMDb API key
3. Get your TMDB API read access token
4. Enter the details into the `src/environments/environment.production.ts` file

## Running locally

- `nx run movies:build:development`: development build
- `nx run movies:build:production`: production build (output: `dist/projects/movies`)
- `npm start` / `nx run movies:serve:development`: dev server on port 4200
- `nx run movies:serve-static`: serve the production build locally
- `nx run docs:build`: regenerate README bundle stats (output: `dist/measures/movies`)

## Tech Stack

Built with:

- [Angular](https://angular.io)
- [rx-angular](https://github.com/rx-angular/rx-angular)

[![angular-and-rx-angular](https://user-images.githubusercontent.com/10064416/154189195-c32cbdec-b061-46a5-8590-a9e3d8dc050a.png)](https://www.rx-angular.io/)

Measures:

- Bundle size listed from dist folder
- Comparison videos with [webpagetest](https://www.webpagetest.org)
- Lighthoure reports with [lighthouse-metrics](https://lighthouse-metrics.com)
- User-flows created with [@push-based/user-flow](https://www.npmjs.com/package/@push-based/user-flow)

## Authors

- [push-based.io](https://push-based.io)
- [Michael Hladky](https://github.com/BioPhoton)
- [Kirill Karnaukhov](https://github.com/Karnaukhov-kh)
- [Julian Jandl](https://github.com/HoebbelsB)
- [Vojtech Mašek](https://github.com/vmasek)
- [Enea Jahollari](https://github.com/eneajaho)
- [Matthieu Riegler](https://github.com/jeanmeche)

Based on the original `angular-movies` foundation by [@clamarque](https://github.com/clamarque/angular-movies).

## License

[MIT](https://choosealicense.com/licenses/mit/)
