import { Component, effect, inject, input, numberAttribute } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PassengerService } from '../../logic-passenger/data-access/passenger.service';
import { validatePassengerStatus } from '../../util-validation/passenger-validator/passenger-status.validator';


@Component({
  selector: 'app-passenger-edit',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './passenger-edit.component.html'
})
export class PassengerEditComponent {
  private readonly passengerService = inject(PassengerService);
  protected editForm = inject(NonNullableFormBuilder).group({
    id: [0],
    firstName: [''],
    name: [''],
    bonusMiles: [0],
    passengerStatus: ['', [
      validatePassengerStatus(['A', 'B', 'C'])
    ]]
  });

  readonly id = input(0, { transform: numberAttribute });
  protected readonly passengerResource = this.passengerService.findByIdAsResource(this.id);

  constructor() {
    effect(() => {
      if (this.passengerResource.hasValue()) {
        this.editForm.patchValue(
          this.passengerResource.value()
        )
      }
    });
  }

  protected save(): void {
    console.log(this.editForm.value);
    this.passengerResource.set(
      this.editForm.getRawValue()
    );
  }
}
