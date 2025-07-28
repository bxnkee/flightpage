import { Flight } from '../types';
import { europeanAirports } from './airports';

// Generate sample flights for demonstration
export const generateFlights = (from: string, to: string, date: string): Flight[] => {
  const fromAirport = europeanAirports.find(a => a.iata === from || a.city.toLowerCase() === from.toLowerCase());
  const toAirport = europeanAirports.find(a => a.iata === to || a.city.toLowerCase() === to.toLowerCase());
  
  if (!fromAirport || !toAirport) return [];

  const flights: Flight[] = [
    {
      id: `MF001-${Date.now()}`,
      airline: 'MillionFlights',
      flightNumber: 'MF001',
      departure: {
        airport: fromAirport,
        time: '08:30',
        date: date
      },
      arrival: {
        airport: toAirport,
        time: '11:45',
        date: date
      },
      duration: '3h 15m',
      aircraft: 'Boeing 737-800',
      price: 189,
      currency: 'EUR',
      availableSeats: 42,
      class: 'economy'
    },
    {
      id: `MF002-${Date.now()}`,
      airline: 'MillionFlights',
      flightNumber: 'MF002',
      departure: {
        airport: fromAirport,
        time: '14:20',
        date: date
      },
      arrival: {
        airport: toAirport,
        time: '17:35',
        date: date
      },
      duration: '3h 15m',
      aircraft: 'Airbus A310',
      price: 225,
      currency: 'EUR',
      availableSeats: 28,
      class: 'economy'
    },
    {
      id: `MF003-${Date.now()}`,
      airline: 'MillionFlights',
      flightNumber: 'MF003',
      departure: {
        airport: fromAirport,
        time: '19:10',
        date: date
      },
      arrival: {
        airport: toAirport,
        time: '22:25',
        date: date
      },
      duration: '3h 15m',
      aircraft: 'Embraer ERJ-145XR',
      price: 159,
      currency: 'EUR',
      availableSeats: 15,
      class: 'economy'
    },
    {
      id: `MF004-${Date.now()}`,
      airline: 'MillionFlights',
      flightNumber: 'MF004',
      departure: {
        airport: fromAirport,
        time: '06:45',
        date: date
      },
      arrival: {
        airport: toAirport,
        time: '10:00',
        date: date
      },
      duration: '3h 15m',
      aircraft: 'Boeing 737-800',
      price: 299,
      currency: 'EUR',
      availableSeats: 18,
      class: 'business'
    }
  ];

  return flights;
};