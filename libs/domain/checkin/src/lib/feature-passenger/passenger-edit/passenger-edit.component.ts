import { httpResource } from '@angular/common/http';
import { Component, input, numberAttribute, signal } from '@angular/core';
import { form, FormField, required, schema } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { initialPassenger, Passenger } from '../../logic-passenger/model/passenger';

export const passengerSchema = schema<Passenger>(passengerPath => {
  required(passengerPath.name, {
    message: 'Please enter a name - this field is mandatory.'
  });
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
  private readonly passenger = signal(initialPassenger);

  // (2) Field State: value, valid, dirty, touched
  protected readonly editForm = form(this.passenger, passengerSchema);


  protected readonly passengerResource = httpResource<Passenger>(() => ({
    url: 'https://demo.angulararchitects.io/api/passenger',
    params: { id: this.id() }
  }), { defaultValue: initialPassenger });

  protected save(): void {
    console.log(
      this.editForm().value(),
      this.passengerResource.value()
    );
    this.passengerResource.set(
      this.editForm().value()
    );
  }
}
