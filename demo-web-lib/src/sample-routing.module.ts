import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SampleComponent} from './sample.component/sample.component';

const ROUTES = [
    {
        path: '',
        component: SampleComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES)
    ],
    exports: [
        RouterModule
    ]
})
export class SampleRoutingModule {
}
