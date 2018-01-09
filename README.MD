### Why not using [ng-packagr](https://github.com/dherges/ng-packagr)?


ng-packagr has really cool features and it implements Angular Package Format. Sadly, i could not make it work with lazy loading.
If you don't need lazy loading go ahead and use it.


## Folder structure and required files

```
-- your_library
    --src
        --app
            --demo.module.ts
        --index.ts
        --public_api.ts
    --package.json
```

### public_api.ts


```
export {DemoComponent} from './app/demo.component/demo.component';
export {DemoPipe} from './app/demo.pipe';
export {DemoModule} from './app/demo.module';

```

### index.ts

```
export * from './public_api';
```


## Build

1. add the path to lazy module in your package.json (relative to src folder)
```
  "lazy-module": "app/demo.module.ts",
```

2. build the module
```
    ng-lb --rootDir path/to/your/source --outDir path/to/dist
```


## Lazy loading usage


1. include the package in src/tsconfig.app.json

```

"include": [
    "./",
    "../node_modules/@ng-library-builder/**/*.ts"
  ]

```
2. configure the lazy route
```

const routes: Routes = [{
  path: 'lazy',
  loadChildren: '@ng-library-builder/demo-web-lib/app/demo.module#DemoModule'
}];

```

## Demo

[see demo-web-app and demo-web-lib](https://github.com/gsuveti/ng-library-builder)


## Thanks

Special thanks to [angular-library-builder](https://github.com/bmvantunes/angular-library-builder) and [ng-packagr](https://github.com/dherges/ng-packagr).