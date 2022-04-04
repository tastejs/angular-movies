The SSR setup builds 2 applications.
One executed on the server to produce the static DOM, and one shipped to the client with all the interactivity.
There are several thing to notice here:
- The SSR version is never executed in a real browser. Any native API is mocked there or not working at all.
- The resulting HTML is later enriched with the CSR version bundeled javascript and served to the client.
- The generated DOM from SSR helps for a LCP
- When javascript cick's in Angular takes over the site. It removes the existing DOM completely and renders Angular.
- HTTP requests executed on the server are cached and replayed on the client

On SSR the assets folder is accessible under `http://localhost:4200/assets/*` 
On CSR the assets folder is accessible under `assets/*`

HTTP Transfere State
- Is used on both sides to read or write to the DOM cache
- By default `HTTPInterceptor`'s are in place to hook into every get request and store the data in the DOM
- On the client side the 
