### Why not using [ng-packagr](https://github.com/dherges/ng-packagr)?


ng-packagr has really cool features and it implements Angular Package Format. Sadly, i could not make it work with lazy loading.
If you don't need lazy loading go ahead and use it.

# How to build and publish angular modules

Following these steps allows you to build and publish your modules to a remote repository.





## Folder structure and required files

```
-- your_library
    --src
        --index.ts
        --public_api.ts
    --package.json
```

### public_api.ts


```
export {SampleComponent} from './sample.component/sample.component';
export {SamplePipe} from './sample.pipe';
export {SampleModule} from './sample.module';
```

### index.ts

```
export * from './public_api';
```


## Build

    ng-lb --rootDir path/to/your/source --outDir path/to/dist


Will do build and then publish.

## Usage

```
import {SampleModule} from "demo-web-lib/public_api";

@NgModule({
    imports: [
        ...,
        SampleModule
    ],
    ...
})

export class AppModule {
}
```

or with lazy loading

```
const ROUTES = [
 {
        path: 'sample',
        loadChildren: 'demo-web-lib#SampleModule'
 },
 ...
]
```

## Demo

[ng-playground](https://github.com/gsuveti/ng-playground)


## Coming soon

Soon the possibility to extend/override the tsconfig.json will be added.

## Thanks

Special thanks to [angular-library-builder](https://github.com/bmvantunes/angular-library-builder) and [ng-packagr](https://github.com/dherges/ng-packagr).