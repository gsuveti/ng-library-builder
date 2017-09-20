# How to build and publish angular modules

Following these steps allows you publish your modules to a remote repository.


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
