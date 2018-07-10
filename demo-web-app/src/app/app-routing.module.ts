import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [{
  path: 'lazy',
  // loadChildren: '@irian-ro/demo-web-lib/app/sample.module#SampleModule'
  loadChildren: '@irian-ro/demo-web-lib/app/sample.module#SampleModule'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
