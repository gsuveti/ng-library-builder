import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'dwl-demo-component',
    templateUrl: './demo.component.html',
    styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

    constructor(private translateService: TranslateService) {
        translateService.use('en');
    }

    ngOnInit(): void {

    }
}
