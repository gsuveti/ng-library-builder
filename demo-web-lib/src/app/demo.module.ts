import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DemoComponent} from './demo.component/demo.component';
import {DemoDirective} from './demo.directive';
import {DemoPipe} from './demo.pipe';
import {DemoRoutingModule} from './demo-routing.module';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpModule} from "@angular/http";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './demo-web-lib/i18n/', '.json');
}

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        DemoRoutingModule,
        HttpClientModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            },
            isolate: true
        })
    ],
    declarations: [
        DemoComponent,
        DemoDirective,
        DemoPipe
    ],
    exports: [
        DemoComponent,
        DemoDirective,
        DemoPipe
    ]
})
export class DemoModule {

}


