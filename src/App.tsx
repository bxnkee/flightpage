import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  ArrowRight, 
  Phone, 
  Mail, 
  Globe,
  Menu,
  X,
  CheckCircle,
  Clock,
  Shield,
  Award,
  Map
} from 'lucide-react';
import { Flight, Airport } from './types';
import { FlightSearch } from './components/FlightSearch';
import { FlightResults } from './components/FlightResults';
import { BookingForm } from './components/BookingForm';
import { FleetPage } from './components/FleetPage';
import { MapView } from './components/MapView';
import { generateFlights } from './data/flights';
import { europeanAirports } from './data/airports';

type AppView = 'home' | 'search-results' | 'booking' | 'fleet' | 'map' | 'confirmation';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [searchParams, setSearchParams] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "London, UK",
      text: "MillionFlights made my European adventure seamless. Best booking experience I've ever had!",
      rating: 5
    },
    {
      name: "Marco Rodriguez",
      location: "Barcelona, Spain", 
      text: "Incredible deals and fantastic customer service. Will definitely book with them again.",
      rating: 5
    },
    {
      name: "Emma Chen",
      location: "Amsterdam, Netherlands",
      text: "Found the perfect flight at an unbeatable price. Highly recommended!",
      rating: 5
    }
  ];

  const handleFlightSearch = async (params: {
    from: Airport;
    to: Airport;
    departureDate: string;
    passengers: number;
  }) => {
    setIsSearching(true);
    setSearchParams(params);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const flights = generateFlights(params.from.iata, params.to.iata, params.departureDate);
    setSearchResults(flights);
    setCurrentView('search-results');
    setIsSearching(false);
  };

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
    setCurrentView('booking');
  };

  const handleBookingComplete = (id: string) => {
    setBookingId(id);
    setCurrentView('confirmation');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSearchResults([]);
    setSelectedFlight(null);
    setSearchParams(null);
    setBookingId('');
  };

  const handleBackToSearch = () => {
    setCurrentView('search-results');
    setSelectedFlight(null);
  };

  // Render different views
  if (currentView === 'fleet') {
    return <FleetPage onBack={handleBackToHome} />;
  }

  if (currentView === 'map') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50">
        <div className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToHome}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <ArrowRight className="h-6 w-6 text-gray-600 transform rotate-180" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Airport Map</h1>
                <p className="text-gray-600 mt-1">Explore European airports and plan your journey</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MapView 
            airports={europeanAirports} 
            className="h-[600px]"
          />
        </div>
      </div>
    );
  }

  if (currentView === 'booking' && selectedFlight && searchParams) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookingForm
            flight={selectedFlight}
            passengers={searchParams.passengers}
            onBack={handleBackToSearch}
            onBookingComplete={handleBookingComplete}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'confirmation' && bookingId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Booking Confirmed!</h1>
            <p className="text-xl text-gray-600 mb-6">
              Your flight has been successfully booked.
            </p>
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-800 mb-2">Booking Reference</h3>
              <p className="text-2xl font-bold text-sky-600">{bookingId}</p>
            </div>
            <p className="text-gray-600 mb-8">
              A confirmation email has been sent to your email address with all the details.
            </p>
            <button
              onClick={handleBackToHome}
              className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Book Another Flight
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-sky-600 transform rotate-45" />
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-800 bg-clip-text text-transparent">
                millionflights.eu
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => setCurrentView('home')}
                className="text-gray-700 hover:text-sky-600 transition-colors duration-200"
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentView('fleet')}
                className="text-gray-700 hover:text-sky-600 transition-colors duration-200"
              >
                Our Fleet
              </button>
              <button 
                onClick={() => setCurrentView('map')}
                className="text-gray-700 hover:text-sky-600 transition-colors duration-200 flex items-center gap-1"
              >
                <Map className="h-4 w-4" />
                Airport Map
              </button>
              <a href="#contact" className="text-gray-700 hover:text-sky-600 transition-colors duration-200">Contact</a>
              <button className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-2 rounded-full hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md">
                Book Now
              </button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden bg-white/95 backdrop-blur-md`}>
          <div className="px-4 py-4 space-y-2">
            <button 
              onClick={() => { setCurrentView('home'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-gray-700 hover:text-sky-600 transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => { setCurrentView('fleet'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-gray-700 hover:text-sky-600 transition-colors"
            >
              Our Fleet
            </button>
            <button 
              onClick={() => { setCurrentView('map'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-gray-700 hover:text-sky-600 transition-colors"
            >
              Airport Map
            </button>
            <a href="#contact" className="block py-2 text-gray-700 hover:text-sky-600 transition-colors">Contact</a>
            <button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-2 rounded-full mt-2">
              Book Now
            </button>
          </div>
        </div>
      </nav>

      {currentView === 'home' && (
        <>
          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-blue-500/10 to-emerald-400/20"></div>
            
            {/* Animated background elements */}
            <div className="absolute inset-0">
              <div className="absolute top-20 left-10 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
              <div className="absolute top-40 right-20 w-6 h-6 bg-sky-300/40 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-40 left-20 w-3 h-3 bg-emerald-300/40 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
              <div className="absolute top-60 left-1/3 w-5 h-5 bg-blue-300/30 rounded-full animate-bounce" style={{animationDelay: '3s'}}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-sky-600 via-blue-700 to-emerald-600 bg-clip-text text-transparent animate-fade-in">
                Discover Europe
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto animate-slide-up">
                Find the best flight deals across Europe and beyond. Million destinations, one perfect journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '0.3s'}}>
                <button 
                  onClick={() => document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  Search Flights
                  <ArrowRight className="inline ml-2 h-5 w-5" />
                </button>
                <button 
                  onClick={() => setCurrentView('fleet')}
                  className="border-2 border-sky-500 text-sky-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-sky-500 hover:text-white transition-all duration-300"
                >
                  View Our Fleet
                </button>
              </div>
            </div>
          </section>

          {/* Flight Search Section */}
          <section id="search" className="py-20 bg-white/50 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <FlightSearch onSearch={handleFlightSearch} isLoading={isSearching} />
            </div>
          </section>

          {/* Services Section */}
          <section id="services" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose MillionFlights?</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  We make traveling across Europe and beyond simple, affordable, and unforgettable.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: CheckCircle,
                    title: "Best Prices",
                    description: "Guaranteed competitive prices on flights across Europe",
                    color: "text-emerald-500",
                    bgColor: "bg-emerald-50"
                  },
                  {
                    icon: Clock,
                    title: "24/7 Support",
                    description: "Round-the-clock customer service whenever you need us",
                    color: "text-blue-500",
                    bgColor: "bg-blue-50"
                  },
                  {
                    icon: Shield,
                    title: "Secure Booking",
                    description: "Your personal and payment information is always protected",
                    color: "text-purple-500",
                    bgColor: "bg-purple-50"
                  },
                  {
                    icon: Award,
                    title: "Trusted Partner",
                    description: "Over 1 million satisfied customers across Europe",
                    color: "text-orange-500",
                    bgColor: "bg-orange-50"
                  }
                ].map((service, index) => (
                  <div 
                    key={index}
                    className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className={`${service.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className={`h-8 w-8 ${service.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20 bg-gradient-to-r from-sky-50 to-blue-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
                <p className="text-xl text-gray-600">Join millions of happy travelers across Europe</p>
              </div>

              <div className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-2xl text-center transform transition-all duration-500">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg text-gray-700 mb-6 italic">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonials[currentTestimonial].name}</h4>
                    <p className="text-sky-600">{testimonials[currentTestimonial].location}</p>
                  </div>
                </div>

                <div className="flex justify-center mt-8 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentTestimonial ? 'bg-sky-500 w-8' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Get in Touch</h2>
                <p className="text-xl text-gray-600">Ready to start your journey? We're here to help!</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="flex items-center space-x-4 group">
                    <div className="bg-sky-100 p-4 rounded-full group-hover:bg-sky-200 transition-colors duration-300">
                      <Phone className="h-6 w-6 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
                      <p className="text-gray-600">+31 20 123 4567</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 group">
                    <div className="bg-emerald-100 p-4 rounded-full group-hover:bg-emerald-200 transition-colors duration-300">
                      <Mail className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                      <p className="text-gray-600">hello@millionflights.eu</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 group">
                    <div className="bg-blue-100 p-4 rounded-full group-hover:bg-blue-200 transition-colors duration-300">
                      <Globe className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Website</h3>
                      <p className="text-gray-600">www.millionflights.eu</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-8 rounded-3xl">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="First Name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Last Name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                    
                    <input 
                      type="email" 
                      placeholder="Email Address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                    />
                    
                    <textarea 
                      placeholder="Your Message"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 resize-none"
                    ></textarea>
                    
                    <button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <Plane className="h-8 w-8 text-sky-400 transform rotate-45" />
                    <span className="text-2xl font-bold">millionflights.eu</span>
                  </div>
                  <p className="text-gray-400 max-w-md">
                    Your trusted partner for finding the best flight deals across Europe and beyond. 
                    Making travel dreams come true since 2020.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><button onClick={() => document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-sky-400 transition-colors">Search Flights</button></li>
                    <li><button onClick={() => setCurrentView('fleet')} className="hover:text-sky-400 transition-colors">Our Fleet</button></li>
                    <li><button onClick={() => setCurrentView('map')} className="hover:text-sky-400 transition-colors">Airport Map</button></li>
                    <li><a href="#contact" className="hover:text-sky-400 transition-colors">Contact</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Support</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-sky-400 transition-colors">Help Center</a></li>
                    <li><a href="#" className="hover:text-sky-400 transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-sky-400 transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-sky-400 transition-colors">Refund Policy</a></li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2025 millionflights.eu. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </>
      )}

      {currentView === 'search-results' && (
        <div className="pt-20 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <button
                onClick={handleBackToHome}
                className="flex items-center gap-2 text-sky-600 hover:text-sky-700 transition-colors duration-200 mb-4"
              >
                <ArrowRight className="h-5 w-5 transform rotate-180" />
                Back to Search
              </button>
              
              {searchParams && (
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Results</h2>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-sky-500" />
                      <span>{searchParams.from.city} → {searchParams.to.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <span>{searchParams.departureDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-500" />
                      <span>{searchParams.passengers} passenger{searchParams.passengers > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <FlightResults 
              flights={searchResults} 
              onSelectFlight={handleFlightSelect}
              isLoading={isSearching}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .selected-airport-marker {
          filter: hue-rotate(120deg) saturate(1.5);
        }
      `}</style>
    </div>
  );
}

export default App;