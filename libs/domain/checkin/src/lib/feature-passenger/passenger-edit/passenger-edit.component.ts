import { httpResource } from '@angular/common/http';
import { Component, input, numberAttribute } from '@angular/core';
import { form, FormField, required, schema, SchemaPath, validate } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { initialPassenger, Passenger } from '../../logic-passenger/model/passenger';

export function validateFirstname(
  firstname: SchemaPath<string>,
  validFirstnames: string[]
): void {
  validate(firstname, ({ value }) => {
    if (!validFirstnames.includes(value())) {
      return {
        kind: 'fordbiddenFirstname',
        message:
          'This firstname is not allowed. Please use one of the following: ' + validFirstnames.join(', ')
      }
    }

    return null;
  });
}

export const passengerSchema = schema<Passenger>(passengerPath => {
  required(passengerPath.name, {
    message: 'Please enter a name - this field is mandatory.'
  });
  validateFirstname(passengerPath.firstName, [
    'Emma', 'Mia', 'Hanna'
  ])
});

@Component({
  selector: 'app-passenger-edit',
  imports: [
    RouterLink,
    // (4) UI Control: Template Binding
    FormField
  ],
  templateUrl: './passenger-edit.component.html'
})
export class PassengerEditComponent {
  readonly id = input(0, { transform: numberAttribute });
  
  // (1) Data Model: Writable Signal
  protected readonly passengerResource = httpResource<Passenger>(() => ({
    url: 'https://demo.angulararchitects.io/api/passenger',
    params: { id: this.id() }
  }), { defaultValue: initialPassenger });

  // (2) Field State: value, valid, dirty, touched
  protected readonly editForm = form(this.passengerResource.value, passengerSchema);

  protected save(): void {
    console.log(this.passengerResource.value());
  }
}
