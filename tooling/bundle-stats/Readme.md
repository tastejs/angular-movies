# Bundle State

In this folder structure lives the bundlestats codebase to perform the following things:

- Update main readmes with the bundle stats


Add mark a section in your readme with `<!-- bundle-stats-start -->` & `<!-- bundle-stats-end -->`.

run 
`npx ts-node -P ./tooling/tsconfig.json  ./tooling/bundle-stats/index.ts update-bundle-stats --stats=<path> --target=<path>`

**Expected output:**

`<!-- bundle-stats-start -->`  

| Names             |       Size |  
| ---               | ---        |  
| main.5de80b3a332abb7b.js           | 328.77 KB |  
| styles.cc65c6709a6ae634.css           | 5.37 KB |  
| runtime.cf36f3597ba77fda.js           | 3.73 KB |  
| **Initial Total** | **337.87 KB** |  
| Names             |       Size |  
| projects_movies_src_app_pages_not-found-page_not-found-page_module_ts.fae776b5c61c1a24.js           | 12.31 KB |  
| common.ed8efc2ecffef487.js           | 10.87 KB |  

`<!-- bundle-stats-end -->`
