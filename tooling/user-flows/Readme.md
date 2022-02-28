# LightHouse User Flows

In this folder structure lives the LightHouse UserFlow codebase to performa the following tests:

**Legend**
- 🥶: cold navigation/bootstrap/interaction 
- 🥵: warm navigation/bootstrap/interaction 

**Mobile**
- [Initial Load - 🥶](./flows/initial-load--cold.ts)
- [Initial Load - 🥵](./flows/initial-load--cold.ts)
- [Category to Category Navigation - 🥶](./flows/category-to-category-cold-navigation.ts)
- [Category to Category Navigation - 🥵](./flows/category-to-category-cold-navigation.ts)
- [Genre to Genre Navigation - 🥶](./flows/category-to-category-cold-navigation.ts)
- [Genre to Genre Navigation - 🥵](./flows/category-to-category-cold-navigation.ts)


run 
`npx ts-node -P ./tooling/tsconfig.json  ./tooling/user-flows/index.ts run --targetUrl=<url>`
