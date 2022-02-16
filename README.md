# angular-movies

This is a Movies App built using Angular and [The Movie Database (TMDB)](https://www.themoviedb.org/) API. 

## Demo

A [live deployment](https://angular-movies-a12d3.web.app/list/category/popular) of this app is available to try it out.

## Comparison to next app

- [next](https://lighthouse-metrics.com/one-time-tests/61299c3173820a000836ac3b)
- [angular](https://lighthouse-metrics.com/one-time-tests/61299973401f0d0009349b33)

## Performance Improvements

For now you can search the codebase for "Perf Tip" later on there will be propper documentation here.


[Measures before optimization](https://lighthouse-metrics.com/one-time-tests/616db7e91cff420008f70364)
![angular-movies-before_michael-hladky](https://user-images.githubusercontent.com/10064416/137785051-1cf9f63a-e803-4d92-a952-c327b7628530.PNG)


[Measures after optimization](https://lighthouse-metrics.com/checks/6a888a17-b17b-46a6-abc9-e605b73a530c/runs/503701ad-36aa-43ad-8de3-cb40e775c770)
![angular-movies-after-optimization_michael-hladky](https://user-images.githubusercontent.com/10064416/146446241-ad9eeed4-b0a4-44a2-a88e-4ea7c97e1acf.PNG)

| Initial Chunk Files           | Names         |      Size |
| ---                           | ---           | ---       |
| main.0537ac5709d0b1e2.js      | main          | **316.55 kB** |
| styles.13c939b5c2369df2.css   | styles        |   5.00 kB |
| runtime.793b54f5d026691d.js   | runtime       |   2.73 kB |
|                               | **Initial Total** | **324.39 kB** |
| Lazy Chunk Files              | Names         |      Size |
| 849.c98331a772ee31b8.js       | -             |  12.18 kB |
| common.80ee1cdf1082c3de.js    | common        |  10.10 kB |
| 614.4143cf052f9e5361.js       | -             |   3.36 kB |

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

* Angular
* rx-angular
  
## Authors

- [push-based.io](https://push-based.io)
- [Michael Hladky](https://github.com/BioPhoton)
- [Kirill Karnaukhov](https://github.com/Karnaukhov-kh)
- [Julian Jandl](https://github.com/HoebbelsB)
- [Vojtech Mašek](https://github.com/vmasek)


Based on the original `angular-movies` foundation by [@clamarque](https://github.com/clamarque/angular-movies).
  
## License

[MIT](https://choosealicense.com/licenses/mit/)
