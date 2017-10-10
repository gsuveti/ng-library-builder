# Demo web lib

##Demo angular library

###eager loading usage
    ```
    import {SampleModule} from "demo-web-lib/public_api";

    @NgModule({
        imports: [
            BrowserModule,
            SampleModule,
            AppRoutingModule,
            ...
        ],
        ...
    })
    export class AppModule {
    }

    ```

###lazy loading usage
    ```
     const ROUTES = [
         {
             path: 'sample',
             loadChildren: 'demo-web-lib#SampleModule'
         }
     ];
    ```

## Dev mode usage

1. link the library
    ```
    cd src
    npm link
    ```

2. go to your angular app
3. use the library
    ```
    npm link demo-web-lib
    ```

## Exit dev mode

1. go to your angular app
2. remove the app link
    ```
    npm unlink demo-web-lib
    ```
3. unlink the library
    ```
    cd src
    npm unlink
    ```


More about npm link [here](https://docs.npmjs.com/cli/link)
