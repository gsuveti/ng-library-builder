# Demo web lib

##Demo angular library

###lazy loading usage
    ```
     const ROUTES = [
         {
             path: 'sample',
             loadChildren: '@irian/demo-web-lib#SampleModule'
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
    npm link @irian/demo-web-lib
    ```

## Exit dev mode

1. go to your angular app
2. remove the app link
    ```
    npm unlink @irian/demo-web-lib
    ```
3. unlink the library
    ```
    cd src
    npm unlink
    ```


More about npm link [here](https://docs.npmjs.com/cli/link)
