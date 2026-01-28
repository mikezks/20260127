import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, computed, effect, inject, Injector, runInInjectionContext, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Flight } from '../../logic-flight/model/flight';
import { injectTicketsFacade } from '../../logic-flight/state/facade';
import { FlightCardComponent } from '../../ui-flight/flight-card/flight-card.component';
import { FlightFilterComponent } from '../../ui-flight/flight-filter/flight-filter.component';
import { FlightService } from '@flight-demo/domain/booking-api-boarding';
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
  private ticketsFacade = injectTicketsFacade();
  private readonly cdRef = inject(ChangeDetectorRef);
  private readonly injector = inject(Injector);

  protected filter = signal({
    from: 'Paris',
    to: 'New York',
    urgent: false
  });
  protected readonly route = computed(
    () => 'From ' + this.filter().from + ' to ' + this.filter().to + '.'
  );
  protected basket: Record<number, boolean> = {
    3: true,
    5: true
  };
  protected flights$ = this.ticketsFacade.flights$;

  constructor() {
    const loggerEffectRef = effect(() => console.log(this.route()));
    effect(() => {
      this.filter();
      untracked(() => this.search());
    });
    
    setTimeout(() => loggerEffectRef.destroy(), 10_000);
  }

  protected search(): void {
    effect(() => console.log(this.route()), {
      injector: this.injector
    });

    const flightService = runInInjectionContext(
      this.injector,
      () => inject(FlightService)
    );
    console.log(flightService.flights);
    

    if (!this.filter().from || !this.filter().to) {
      return;
    }

    this.ticketsFacade.search(this.filter());
  }

  protected delay(flight: Flight): void {
    const oldFlight = flight;
    const oldDate = new Date(oldFlight.date);

    const newDate = new Date(oldDate.getTime() + 1000 * 60 * 5); // Add 5 min
    const newFlight = {
      ...oldFlight,
      date: newDate.toISOString(),
      delayed: true
    };

    this.ticketsFacade.update(newFlight);
  }

  protected reset(): void {
    this.ticketsFacade.reset();
  }
}
