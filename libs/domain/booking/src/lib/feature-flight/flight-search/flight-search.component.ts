import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Flight } from '../../logic-flight/model/flight';
import { BookingStore } from '../../logic-flight/state/booking.store';
import { FlightCardComponent } from '../../ui-flight/flight-card/flight-card.component';
import { FlightFilterComponent } from '../../ui-flight/flight-filter/flight-filter.component';
// import { SIGNAL } from '@angular/core/primitives/signals';


@Component({
  selector: 'app-flight-search',
  imports: [
    CommonModule,
    FormsModule,
    FlightCardComponent,
    FlightFilterComponent
  ],
  templateUrl: './flight-search.component.html',
})
export class FlightSearchComponent {
  protected readonly store = inject(BookingStore);

  protected readonly route = computed(
    () => 'From ' + this.store.filter().from + ' to ' + this.store.filter().to + '.'
  );

  protected delay(flight: Flight): void {
    const oldFlight = flight;
    const oldDate = new Date(oldFlight.date);

    const newDate = new Date(oldDate.getTime() + 1000 * 60 * 5); // Add 5 min
    const newFlight = {
      ...oldFlight,
      date: newDate.toISOString(),
      delayed: true
    };

    this.store.setFlights(this.store.flights().map(
      flight => flight.id === newFlight.id ? newFlight : flight
    ));
  }
}
