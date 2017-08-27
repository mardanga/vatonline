import { IControlador } from './../../clases/controlador';
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'seguido',
})
export class SeguidoPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value:IControlador[], parametro: number):IControlador[] {
    ///console.log(value);
    return value.filter(atc=> atc.notificar == parametro);
  }
}
