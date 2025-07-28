import { Aircraft } from '../types';

export const fleetData: Aircraft[] = [
  {
    id: 'boeing-737',
    model: 'Boeing 737-800',
    manufacturer: 'Boeing',
    capacity: 189,
    range: '5,765 km',
    description: 'Our flagship Boeing 737-800 aircraft represents the perfect balance of reliability, comfort, and efficiency. With its proven track record and advanced technology, this aircraft ensures a smooth and comfortable journey for all passengers.',
    features: [
      'Advanced fuel-efficient engines',
      'Spacious cabin with modern amenities',
      'Enhanced safety systems',
      'Comfortable seating with extra legroom',
      'In-flight entertainment system',
      'Wi-Fi connectivity available'
    ],
    imageUrl: 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=800',
    specifications: {
      length: '39.5 m',
      wingspan: '35.8 m',
      height: '12.5 m',
      maxSpeed: '876 km/h',
      cruisingSpeed: '828 km/h'
    }
  },
  {
    id: 'airbus-a310',
    model: 'Airbus A310',
    manufacturer: 'Airbus',
    capacity: 280,
    range: '9,600 km',
    description: 'The Airbus A310 in our fleet emphasizes efficiency and exceptional passenger experience. This wide-body aircraft offers superior comfort for medium to long-haul flights, featuring spacious cabins and advanced passenger amenities.',
    features: [
      'Wide-body comfort for enhanced passenger experience',
      'Fuel-efficient twin-engine design',
      'Advanced avionics and navigation systems',
      'Quiet cabin environment',
      'Premium seating configurations',
      'State-of-the-art climate control'
    ],
    imageUrl: 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=800',
    specifications: {
      length: '46.7 m',
      wingspan: '43.9 m',
      height: '15.8 m',
      maxSpeed: '900 km/h',
      cruisingSpeed: '850 km/h'
    }
  },
  {
    id: 'embraer-erj145',
    model: 'Embraer ERJ-145XR',
    manufacturer: 'Embraer',
    capacity: 50,
    range: '3,700 km',
    description: 'Our Embraer ERJ-145XR aircraft focuses on regional connectivity, providing excellent service to smaller European destinations. This efficient regional jet offers the perfect solution for connecting communities across Europe.',
    features: [
      'Optimal for regional route connectivity',
      'Excellent fuel efficiency',
      'Quick boarding and deplaning',
      'Comfortable 2+1 seating configuration',
      'Advanced weather radar systems',
      'Low noise footprint'
    ],
    imageUrl: 'https://images.pexels.com/photos/1309644/pexels-photo-1309644.jpeg?auto=compress&cs=tinysrgb&w=800',
    specifications: {
      length: '29.9 m',
      wingspan: '20.0 m',
      height: '6.8 m',
      maxSpeed: '834 km/h',
      cruisingSpeed: '800 km/h'
    }
  },
  {
    id: 'airbus-a320',
    model: 'Airbus A320',
    manufacturer: 'Airbus',
    capacity: 180,
    range: '6,150 km',
    description: 'Our value-oriented Airbus A320 provides economical travel solutions without compromising on safety or comfort. This budget-friendly aircraft offers excellent value for cost-conscious travelers seeking reliable transportation.',
    features: [
      'Cost-effective travel solution',
      'Proven reliability and safety record',
      'Comfortable economy seating',
      'Efficient operations for competitive pricing',
      'Modern cockpit technology',
      'Environmentally conscious design'
    ],
    imageUrl: 'https://images.pexels.com/photos/1309644/pexels-photo-1309644.jpeg?auto=compress&cs=tinysrgb&w=800',
    specifications: {
      length: '37.6 m',
      wingspan: '35.8 m',
      height: '11.8 m',
      maxSpeed: '871 km/h',
      cruisingSpeed: '828 km/h'
    }
  },
  {
    id: 'bombardier-crj900',
    model: 'Bombardier CRJ900',
    manufacturer: 'Bombardier',
    capacity: 90,
    range: '2,956 km',
    description: 'The Bombardier CRJ900 represents our commitment to providing economical regional services. This aircraft delivers exceptional value through efficient operations while maintaining high standards of passenger comfort and safety.',
    features: [
      'Economical regional jet operations',
      'Spacious cabin for a regional aircraft',
      'Advanced fuel management systems',
      'Quick turnaround capabilities',
      'Comfortable 2+2 seating layout',
      'Reliable performance in various weather conditions'
    ],
    imageUrl: 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=800',
    specifications: {
      length: '36.2 m',
      wingspan: '24.9 m',
      height: '7.5 m',
      maxSpeed: '870 km/h',
      cruisingSpeed: '829 km/h'
    }
  }
];