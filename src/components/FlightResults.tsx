import React from 'react';
import { Plane, Clock, MapPin, Users, Euro } from 'lucide-react';
import { Flight } from '../types';
import { format } from 'date-fns';

interface FlightResultsProps {
  flights: Flight[];
  onSelectFlight: (flight: Flight) => void;
  isLoading?: boolean;
}

export const FlightResults: React.FC<FlightResultsProps> = ({ 
  flights, 
  onSelectFlight, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Searching for flights...</h3>
          <p className="text-gray-600">Please wait while we find the best options for you</p>
        </div>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
        <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No flights found</h3>
        <p className="text-gray-600">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Available Flights ({flights.length} found)
      </h3>
      
      {flights.map((flight) => (
        <div
          key={flight.id}
          className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Flight Info */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-sky-100 p-3 rounded-full">
                    <Plane className="h-6 w-6 text-sky-600 transform rotate-45" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">
                      {flight.airline} {flight.flightNumber}
                    </h4>
                    <p className="text-sm text-gray-600">{flight.aircraft}</p>
                  </div>
                </div>

                {/* Route */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {flight.departure.time}
                    </div>
                    <div className="text-sm text-gray-600">
                      {flight.departure.airport.iata}
                    </div>
                    <div className="text-xs text-gray-500">
                      {flight.departure.airport.city}
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <Clock className="h-4 w-4" />
                      <div className="text-xs font-medium">{flight.duration}</div>
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <Plane className="h-4 w-4 transform rotate-45" />
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {flight.arrival.time}
                    </div>
                    <div className="text-sm text-gray-600">
                      {flight.arrival.airport.iata}
                    </div>
                    <div className="text-xs text-gray-500">
                      {flight.arrival.airport.city}
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{flight.availableSeats} seats left</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="capitalize">{flight.class} class</span>
                  </div>
                </div>
              </div>

              {/* Price and Book */}
              <div className="lg:text-right">
                <div className="mb-4">
                  <div className="text-3xl font-bold text-sky-600 flex items-center justify-end gap-1">
                    <Euro className="h-6 w-6" />
                    {flight.price}
                  </div>
                  <div className="text-sm text-gray-500">per person</div>
                </div>

                <button
                  onClick={() => onSelectFlight(flight)}
                  className="w-full lg:w-auto bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Select Flight
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};