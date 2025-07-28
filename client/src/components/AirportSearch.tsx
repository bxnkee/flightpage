import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Airport } from '../types';
import { searchAirports } from '../data/airports';

interface AirportSearchProps {
  placeholder: string;
  onSelect: (airport: Airport) => void;
  selectedAirport?: Airport;
  className?: string;
}

export const AirportSearch: React.FC<AirportSearchProps> = ({
  placeholder,
  onSelect,
  selectedAirport,
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Airport[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedAirport) {
      setDisplayValue(`${selectedAirport.city} (${selectedAirport.iata})`);
    }
  }, [selectedAirport]);

  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = searchAirports(query);
      setResults(searchResults);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setDisplayValue(value);
  };

  const handleSelect = (airport: Airport) => {
    onSelect(airport);
    setDisplayValue(`${airport.city} (${airport.iata})`);
    setQuery('');
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setQuery(displayValue);
    setDisplayValue('');
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      if (selectedAirport && !query) {
        setDisplayValue(`${selectedAirport.city} (${selectedAirport.iata})`);
      }
    }, 200);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-5 w-5 text-sky-500" />
        <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 hover:shadow-md"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
        >
          {results.map((airport) => (
            <button
              key={airport.id}
              onClick={() => handleSelect(airport)}
              className="w-full px-4 py-3 text-left hover:bg-sky-50 focus:bg-sky-50 focus:outline-none transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">
                    {airport.city} ({airport.iata})
                  </div>
                  <div className="text-sm text-gray-500">
                    {airport.name}, {airport.country}
                  </div>
                </div>
                <MapPin className="h-4 w-4 text-sky-500" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};