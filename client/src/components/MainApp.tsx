import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
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
  Map,
  LogIn,
  UserPlus,
  LogOut,
  CreditCard,
  MessageCircle
} from 'lucide-react';
import { FlightSearch } from './FlightSearch';
import { FlightResults } from './FlightResults';
import { BookingForm } from './BookingForm';
import { FleetPage } from './FleetPage';
import { MapView } from './MapView';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import type { Flight, Airport } from '../types/index';

type AppView = 'home' | 'search-results' | 'booking' | 'fleet' | 'map' | 'confirmation' | 'payment';

export function MainApp() {
  const { user, isAuthenticated, logout } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [searchParams, setSearchParams] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');
  const [location] = useLocation();

  // Fetch average rating for trust indicators
  const { data: ratingData } = useQuery({
    queryKey: ['reviews', 'rating'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/reviews/rating');
      return await response.json();
    },
  });

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

  // Handle navigation based on URL path
  useEffect(() => {
    if (location === '/fleet') {
      setCurrentView('fleet');
    } else if (location === '/map') {
      setCurrentView('map');
    } else if (location === '/payment') {
      setCurrentView('payment');
    } else {
      setCurrentView('home');
    }
  }, [location]);

  const testimonials = [
    {
      name: "Sarah Chen",
      location: "Berlin, Germany",
      text: "Absolutely incredible service! Booked my flight to Prague in minutes with their intuitive interface.",
      rating: 5
    },
    {
      name: "Marco Rossi",
      location: "Milan, Italy",
      text: "Best prices I've found anywhere. The real-time updates kept me informed throughout my journey.",
      rating: 5
    },
    {
      name: "Emma Thompson",
      location: "London, UK",
      text: "Customer service was outstanding. They helped me reschedule my flight with no hassle at all.",
      rating: 5
    }
  ];

  const handleSearch = async (params: { from: Airport; to: Airport; departureDate: string; passengers: number; }) => {
    setIsSearching(true);
    setSearchParams(params);
    
    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock results based on search params
      const mockResults: Flight[] = [
        {
          id: '1',
          airline: 'MillionFlights',
          flightNumber: 'MF101',
          departure: {
            airport: params.from,
            time: '08:30',
            date: params.departureDate
          },
          arrival: {
            airport: params.to,
            time: '10:45',
            date: params.departureDate
          },
          duration: '2h 15m',
          aircraft: 'Boeing 737-800',
          price: 129,
          currency: 'EUR',
          availableSeats: 45,
          class: 'economy'
        },
        {
          id: '2',
          airline: 'MillionFlights',
          flightNumber: 'MF205',
          departure: {
            airport: params.from,
            time: '14:20',
            date: params.departureDate
          },
          arrival: {
            airport: params.to,
            time: '16:35',
            date: params.departureDate
          },
          duration: '2h 15m',
          aircraft: 'Airbus A320',
          price: 156,
          currency: 'EUR',
          availableSeats: 23,
          class: 'economy'
        }
      ];
      
      setSearchResults(mockResults);
      setCurrentView('search-results');
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
    setCurrentView('booking');
  };

  const handleBackToSearch = () => {
    setCurrentView('search-results');
    setSelectedFlight(null);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSearchResults([]);
    setSelectedFlight(null);
    setSearchParams(null);
    setBookingId('');
  };

  const handleBookingComplete = (id: string) => {
    setBookingId(id);
    setCurrentView('confirmation');
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  if (currentView === 'fleet') {
    return <FleetPage onBack={handleBackToHome} />;
  }

  if (currentView === 'map') {
    // Import European airports data for the map
    const airports: Airport[] = []; // This will be populated with real data
    return <MapView airports={airports} />;
  }

  if (currentView === 'payment') {
    return <PaymentPage />;
  }

  if (currentView === 'search-results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50">
        <Header 
          isScrolled={isScrolled}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          user={user}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FlightResults
            flights={searchResults}
            onSelectFlight={handleFlightSelect}
            isLoading={isSearching}
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
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Home view (default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50">
      <Header 
        isScrolled={isScrolled}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        user={user}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                Million
              </span>
              <br />
              Flights
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover amazing flight deals across Europe. Book with confidence and fly with comfort.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-12 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Secure Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                <span>Best Price Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span>24/7 Support</span>
              </div>
              {ratingData && (
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span>{ratingData.averageRating}/5 ({ratingData.totalReviews} reviews)</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Search Component */}
          <div className="max-w-4xl mx-auto">
            <FlightSearch
              onSearch={handleSearch}
              isLoading={isSearching}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose MillionFlights?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make flight booking simple, secure, and affordable with our advanced search technology.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Star className="h-8 w-8" />}
              title="Best Prices"
              description="Compare millions of flights to find the best deals across all major airlines."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Secure Booking"
              description="Your payment information is protected with bank-level security encryption."
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="24/7 Support"
              description="Our customer service team is available around the clock to assist you."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-sky-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">
            What Our Customers Say
          </h2>
          
          <div className="relative h-48">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentTestimonial ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function Header({ 
  isScrolled, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  user, 
  isAuthenticated, 
  onLogout 
}: {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  user: any;
  isAuthenticated: boolean;
  onLogout: () => void;
}) {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-2 rounded-lg">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">MillionFlights</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/fleet" className="text-gray-700 hover:text-sky-600 font-medium transition-colors">
              Fleet
            </Link>
            <Link href="/map" className="text-gray-700 hover:text-sky-600 font-medium transition-colors">
              Map
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Hello, {user?.firstName}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/fleet" onClick={() => setIsMobileMenuOpen(false)}>
                <a className="text-gray-700 hover:text-sky-600 font-medium">Fleet</a>
              </Link>
              <Link href="/map" onClick={() => setIsMobileMenuOpen(false)}>
                <a className="text-gray-700 hover:text-sky-600 font-medium">Map</a>
              </Link>
              
              {isAuthenticated ? (
                <div className="flex flex-col gap-3 pt-2 border-t border-gray-200">
                  <span className="text-gray-700">Hello, {user?.firstName}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onLogout}
                    className="flex items-center gap-2 w-full justify-center"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-2 border-t border-gray-200">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 w-full justify-center">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="sm" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 flex items-center gap-2 w-full justify-center">
                      <UserPlus className="h-4 w-4" />
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-sky-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PaymentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-3 rounded-full">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Secure Payment</h1>
          <p className="text-xl text-gray-600">Choose your preferred payment method</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <p className="text-center text-gray-600">
            Payment integration coming soon. This will support credit cards, PayPal, and other secure payment methods.
          </p>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-2 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">MillionFlights</span>
            </div>
            <p className="text-gray-400">
              Your trusted partner for flight bookings across Europe.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Help Center</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Flight Search</a></li>
              <li><a href="#" className="hover:text-white">Hotel Booking</a></li>
              <li><a href="#" className="hover:text-white">Car Rental</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@millionflights.eu</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>www.millionflights.eu</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 MillionFlights. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}