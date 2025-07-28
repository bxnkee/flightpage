export interface Airport {
  id: string;
  name: string;
  city: string;
  country: string;
  iata: string;
  icao: string;
  latitude: number;
  longitude: number;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: Airport;
    time: string;
    date: string;
  };
  arrival: {
    airport: Airport;
    time: string;
    date: string;
  };
  duration: string;
  aircraft: string;
  price: number;
  currency: string;
  availableSeats: number;
  class: 'economy' | 'business' | 'first';
}

export interface Passenger {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  email: string;
  phone: string;
}

export interface Booking {
  id: string;
  flight: Flight;
  passengers: Passenger[];
  selectedSeats: string[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingDate: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  bookings: Booking[];
  preferredLanguage: string;
}

export interface Aircraft {
  id: string;
  model: string;
  manufacturer: string;
  capacity: number;
  range: string;
  description: string;
  features: string[];
  imageUrl: string;
  specifications: {
    length: string;
    wingspan: string;
    height: string;
    maxSpeed: string;
    cruisingSpeed: string;
  };
}