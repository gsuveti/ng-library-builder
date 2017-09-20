# How to build and publish angular modules

Following these steps allows you to build and publish your modules to a remote repository.

## Note

This tool is not ready yet. At this moment, you can clone the github project and use it. Soon, a cli will be available.


### Why not using [ng-packagr](https://github.com/dherges/ng-packagr)?


ng-packagr has really cool features and it implements Angular Package Format. Sadly, i couldn't make it work with lazy loading.
If you don't need lazy loading go ahead and use it.


## Folder structure and required files

```
-- your_library
    --src
        --index.ts
        --public_api.ts
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

Update the build script with your path:

```
"build:lib:your_library": "gulp --src ../../../your_library",

```

Run the build script:

```
npm run build:lib:your_library

```

## Publish

Update the publish script with your path:

```
"publish:lib:your_library": "gulp --src ../../../your_library",

```

Run the publish script:

```
npm run publish:lib:your_library
```

## Usage

```
import {SampleModule} from "demo-web-lib";

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

## Coming soon

A demo app that will use the builded module