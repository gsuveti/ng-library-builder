import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {DemoComponent} from './demo.component/demo.component';

const ROUTES = [
    {
        path: 'demo',
        component: DemoComponent
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
export class DemoRoutingModule {
}
