import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the TimeOnlinePipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'timeOnline',
})
export class TimeOnlinePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string) {
    
    let fecha = new Date();
    fecha.setUTCFullYear(Number(value.substring(0,4)));
    fecha.setUTCMonth(Number(value.substring(5,6)) -1);
    fecha.setUTCDate(Number(value.substring(7,8)));
    fecha.setUTCHours(Number(value.substring(8,10)));
    fecha.setUTCMinutes(Number(value.substring(10,12)));
    fecha.setUTCSeconds(Number(value.substring(12,14)));
    console.log(fecha);
    return fecha.toLocaleString();
  }
}
