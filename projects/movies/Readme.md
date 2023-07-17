# Movies

The SSR setup builds 2 applications.
One executed on the server to produce the static DOM, and one shipped to the client with all the interactivity.
There are several thing to notice here:

- The SSR version is never executed in a real browser. Any native API is mocked there or not working at all.
- The resulting HTML is later enriched with the CSR version bundled javascript and served to the client.
- The generated DOM from SSR helps for a LCP
- When javascript kick's in Angular takes over the site. It removes the existing DOM completely and renders Angular.
- HTTP requests executed on the server are cached and replayed on the client

HTTP Transfer State

- Is used on both sides to read or write to the DOM cache
- By default `HTTPInterceptor`'s are in place to hook into every get request and store the data in the DOM
- On the client side the

## Todos

- configure tags
- modern app bootstrap
- service worker refactoring

## Features to test

### Shell

The shell has the following sections:

- Sidebar
- Toolbar
- Content
  
#### Sidebar

**🖥️ The element can:**

- navigate to [Category list](#Category-list) (`popular`, `top_rated`, `upcoming`)
- navigate to [Genre list](#Genre-list) (list of numeric id's)

**📱 Mobile specific:**

- shrink on mobile
- open/close on mobile

#### Toolbar

**🖥️ The element can:**

- toggle dark mode
- show search bar
  - open/collapse search input on focus/blur
  - search a movie (like search)
    - list movie result
    - list NO movie result
    - (TODO) find, filter, sort movies. Paginated
- open/close account menu
  - login (list account menu options)
  - logout (list guest menu options)

### Pages

**--- guest user ---**

- Page not found
- About (TODO add contributors etc)
- Category list
  - Detail movie
  - Detail person
- Genre list

**--- authenticated user ---**

- My Lists
  - Detail list
  - Edit list
- Create new list

#### Page not found

**🖥️ The page can:**

- shows information

#### About

**🖥️ The page can:**

- shows description
- backlink to movies app
- shows contributors

#### Category list

**Available categories are:**

- `popular`
- `top_rated`
- `upcoming`

**🖥️ The page can:**

- list movies
  - infinite scroll
  - navigate to [Detail movie](#Detail-movie)

#### Detail movie

**🖥️ The page can:**

- show hero image
- show description
- show links
- show actor list
- show recommended movies
  - infinite scroll
  - navigate to [Detail movie](#Detail-movie)

#### Detail actor

**🖥️ The page can:**

- show hero image
- show description
- show recommended movies
  - infinite scroll
  - navigate to [Detail movie](#Detail-movie)

#### Genre list

Available genres are fetched from the server (numeric values)

**🖥️ The page can:**

- list movies
  - infinite scroll
  - navigate to [Detail movie](#Detail-movie)

#### My Lists 

**🖥️ The page can:**
- view all your saved lists

#### Detail list 

**🖥️ The page can:**
- show detail page

#### Edit list 

**🖥️ The page can:**
- add/remove/edit lists

#### Create new list 

**🖥️ The page can:**
- create new lists
