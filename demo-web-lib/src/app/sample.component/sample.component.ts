import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'dwl-sample-component',
    templateUrl: './sample.component.html',
    styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnInit {

    constructor(private translateService: TranslateService) {

    }

    ngOnInit(): void {

    }
}
