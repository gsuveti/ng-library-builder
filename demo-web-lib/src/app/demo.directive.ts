import {Directive, ElementRef} from '@angular/core';

@Directive({
    selector: '[sampleDirective]'
})
export class DemoDirective {

    constructor(private el: ElementRef) {

    }
}
