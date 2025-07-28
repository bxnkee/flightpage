import { Airport } from '../types';

export const europeanAirports: Airport[] = [
  // Major European Airports
  {
    id: 'ams',
    name: 'Amsterdam Airport Schiphol',
    city: 'Amsterdam',
    country: 'Netherlands',
    iata: 'AMS',
    icao: 'EHAM',
    latitude: 52.3086,
    longitude: 4.7639
  },
  {
    id: 'cdg',
    name: 'Charles de Gaulle Airport',
    city: 'Paris',
    country: 'France',
    iata: 'CDG',
    icao: 'LFPG',
    latitude: 49.0097,
    longitude: 2.5479
  },
  {
    id: 'fra',
    name: 'Frankfurt Airport',
    city: 'Frankfurt',
    country: 'Germany',
    iata: 'FRA',
    icao: 'EDDF',
    latitude: 50.0264,
    longitude: 8.5431
  },
  {
    id: 'lhr',
    name: 'London Heathrow Airport',
    city: 'London',
    country: 'United Kingdom',
    iata: 'LHR',
    icao: 'EGLL',
    latitude: 51.4700,
    longitude: -0.4543
  },
  {
    id: 'mad',
    name: 'Madrid-Barajas Airport',
    city: 'Madrid',
    country: 'Spain',
    iata: 'MAD',
    icao: 'LEMD',
    latitude: 40.4719,
    longitude: -3.5626
  },
  {
    id: 'fco',
    name: 'Leonardo da Vinci Airport',
    city: 'Rome',
    country: 'Italy',
    iata: 'FCO',
    icao: 'LIRF',
    latitude: 41.8003,
    longitude: 12.2389
  },
  {
    id: 'muc',
    name: 'Munich Airport',
    city: 'Munich',
    country: 'Germany',
    iata: 'MUC',
    icao: 'EDDM',
    latitude: 48.3538,
    longitude: 11.7861
  },
  {
    id: 'bcn',
    name: 'Barcelona-El Prat Airport',
    city: 'Barcelona',
    country: 'Spain',
    iata: 'BCN',
    icao: 'LEBL',
    latitude: 41.2971,
    longitude: 2.0785
  },
  {
    id: 'vie',
    name: 'Vienna International Airport',
    city: 'Vienna',
    country: 'Austria',
    iata: 'VIE',
    icao: 'LOWW',
    latitude: 48.1103,
    longitude: 16.5697
  },
  {
    id: 'zur',
    name: 'Zurich Airport',
    city: 'Zurich',
    country: 'Switzerland',
    iata: 'ZUR',
    icao: 'LSZH',
    latitude: 47.4647,
    longitude: 8.5492
  },
  {
    id: 'cph',
    name: 'Copenhagen Airport',
    city: 'Copenhagen',
    country: 'Denmark',
    iata: 'CPH',
    icao: 'EKCH',
    latitude: 55.6181,
    longitude: 12.6561
  },
  {
    id: 'arn',
    name: 'Stockholm Arlanda Airport',
    city: 'Stockholm',
    country: 'Sweden',
    iata: 'ARN',
    icao: 'ESSA',
    latitude: 59.6519,
    longitude: 17.9186
  },
  {
    id: 'hel',
    name: 'Helsinki-Vantaa Airport',
    city: 'Helsinki',
    country: 'Finland',
    iata: 'HEL',
    icao: 'EFHK',
    latitude: 60.3172,
    longitude: 24.9633
  },
  {
    id: 'lis',
    name: 'Lisbon Airport',
    city: 'Lisbon',
    country: 'Portugal',
    iata: 'LIS',
    icao: 'LPPT',
    latitude: 38.7813,
    longitude: -9.1357
  },
  {
    id: 'bru',
    name: 'Brussels Airport',
    city: 'Brussels',
    country: 'Belgium',
    iata: 'BRU',
    icao: 'EBBR',
    latitude: 50.9014,
    longitude: 4.4844
  },
  {
    id: 'dub',
    name: 'Dublin Airport',
    city: 'Dublin',
    country: 'Ireland',
    iata: 'DUB',
    icao: 'EIDW',
    latitude: 53.4213,
    longitude: -6.2701
  },
  {
    id: 'waw',
    name: 'Warsaw Chopin Airport',
    city: 'Warsaw',
    country: 'Poland',
    iata: 'WAW',
    icao: 'EPWA',
    latitude: 52.1657,
    longitude: 20.9671
  },
  {
    id: 'prg',
    name: 'Václav Havel Airport Prague',
    city: 'Prague',
    country: 'Czech Republic',
    iata: 'PRG',
    icao: 'LKPR',
    latitude: 50.1008,
    longitude: 14.2632
  },
  {
    id: 'bud',
    name: 'Budapest Ferenc Liszt International Airport',
    city: 'Budapest',
    country: 'Hungary',
    iata: 'BUD',
    icao: 'LHBP',
    latitude: 47.4297,
    longitude: 19.2611
  },
  {
    id: 'ath',
    name: 'Athens International Airport',
    city: 'Athens',
    country: 'Greece',
    iata: 'ATH',
    icao: 'LGAV',
    latitude: 37.9364,
    longitude: 23.9445
  }
];

export const searchAirports = (query: string): Airport[] => {
  if (!query || query.length < 2) return [];
  
  const searchTerm = query.toLowerCase();
  return europeanAirports.filter(airport => 
    airport.name.toLowerCase().includes(searchTerm) ||
    airport.city.toLowerCase().includes(searchTerm) ||
    airport.country.toLowerCase().includes(searchTerm) ||
    airport.iata.toLowerCase().includes(searchTerm) ||
    airport.icao.toLowerCase().includes(searchTerm)
  ).slice(0, 10);
};