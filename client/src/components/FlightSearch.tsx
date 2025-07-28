import React, { useState } from 'react';
import { Calendar, Users, Plane, ArrowRight } from 'lucide-react';
import { Airport } from '../types/index';
import { AirportSearch } from './AirportSearch';

interface FlightSearchProps {
  onSearch: (searchParams: {
    from: Airport;
    to: Airport;
    departureDate: string;
    passengers: number;
  }) => void;
  isLoading?: boolean;
}

export const FlightSearch: React.FC<FlightSearchProps> = ({ onSearch, isLoading = false }) => {
  const [fromAirport, setFromAirport] = useState<Airport | undefined>();
  const [toAirport, setToAirport] = useState<Airport | undefined>();
  const [departureDate, setDepartureDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  const handleSearch = () => {
    if (fromAirport && toAirport && departureDate) {
      onSearch({
        from: fromAirport,
        to: toAirport,
        departureDate,
        passengers
      });
    }
  };

  const isSearchDisabled = !fromAirport || !toAirport || !departureDate || isLoading;

  // Get tomorrow's date as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-[1.02] transition-all duration-300">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Find Your Perfect Flight</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative group">
          <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
          <AirportSearch
            placeholder="Departure city"
            onSelect={setFromAirport}
            selectedAirport={fromAirport}
          />
        </div>

        <div className="relative group">
          <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
          <AirportSearch
            placeholder="Destination city"
            onSelect={setToAirport}
            selectedAirport={toAirport}
          />
        </div>

        <div className="relative group">
          <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
            <input 
              type="date"
              min={minDate}
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:shadow-md"
            />
          </div>
        </div>

        <div className="relative group">
          <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
          <div className="relative">
            <Users className="absolute left-3 top-3 h-5 w-5 text-purple-500" />
            <select 
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 group-hover:shadow-md"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <option key={num} value={num}>
                  {num} Passenger{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <button 
          onClick={handleSearch}
          disabled={isSearchDisabled}
          className={`px-12 py-4 rounded-full text-lg font-semibold transform transition-all duration-300 shadow-xl hover:shadow-2xl ${
            isSearchDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white hover:from-sky-600 hover:to-emerald-600 hover:scale-105'
          }`}
        >
          {isLoading ? (
            <>
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Searching...
            </>
          ) : (
            <>
              Search Flights
              <Plane className="inline ml-2 h-5 w-5 transform rotate-45" />
            </>
          )}
        </button>
      </div>

      {isSearchDisabled && !isLoading && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Please fill in all fields to search for flights
        </p>
      )}
    </div>
  );
};