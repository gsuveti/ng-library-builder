import { Injectable, PipeTransform, Pipe } from '@angular/core';

/**
 * Transforms any input value
 */
@Pipe({
  name: 'samplePipe'
})
@Injectable()
export class DemoPipe implements PipeTransform {
  transform(value: any, args: any[] = null): string {
    return value;
  }
}
