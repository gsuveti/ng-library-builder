import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SampleComponent} from './sample.component/sample.component';
import {SampleDirective} from './sample.directive';
import {SamplePipe} from './sample.pipe';
import {SampleRoutingModule} from './sample-routing.module';
import {TranslateModule} from "@ngx-translate/core";
import {HttpModule} from "@angular/http";

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        SampleRoutingModule,
        TranslateModule.forChild()
    ],
    declarations: [
        SampleComponent,
        SampleDirective,
        SamplePipe
    ],
    exports: [
        SampleComponent,
        SampleDirective,
        SamplePipe
    ]
})
export class SampleModule {

}


