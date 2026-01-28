import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Flight } from '../model/flight';
import { FlightFilter } from '../model/flight-filter';
import { pipe, switchMap } from 'rxjs';
import { inject } from '@angular/core';
import { FlightService } from '../data-access/flight.service';

export const BookingStore = signalStore(
  // DI Setup
  { providedIn: 'root' },
  // State
  withState({
    filter: {
      from: 'Paris',
      to: 'New York',
      urgent: false
    },
    basket: {
      3: true,
      5: true,
    } as Record<number, boolean>,
    flights: [] as Flight[]
  }),
  withComputed(store => ({
    delayed: () => store.flights().filter(flight => flight.delayed),
  })),
  // Updater
  withMethods(store => ({
    setFilter: (filter: FlightFilter) => patchState(store, { filter }),
    setFlights: (flights: Flight[]) => patchState(store, { flights }),
  })),
  // Side-Effect
  withMethods((
    store,
    flightService = inject(FlightService)
  ) => ({
    loadFlights: rxMethod<FlightFilter>(pipe(
      switchMap(filter => flightService.find(
        filter.from, filter.to, filter.urgent
      ).pipe(
        tapResponse({
          next: flights => store.setFlights(flights),
          error: err => console.error(err)
        })
      )),      
    ))
  })),
  withHooks(store => ({
    onInit: () => store.loadFlights(store.filter)
  }))
);