import React, { useState } from 'react';
import { User, Mail, Phone, CreditCard, Lock, ArrowLeft } from 'lucide-react';
import { Flight, Passenger } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface BookingFormProps {
  flight: Flight;
  passengers: number;
  onBack: () => void;
  onBookingComplete: (bookingId: string) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  flight,
  passengers,
  onBack,
  onBookingComplete
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [passengerData, setPassengerData] = useState<Passenger[]>(
    Array.from({ length: passengers }, () => ({
      id: uuidv4(),
      title: 'Mr',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nationality: '',
      passportNumber: '',
      email: '',
      phone: ''
    }))
  );
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = flight.price * passengers;

  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengerData];
    updated[index] = { ...updated[index], [field]: value };
    setPassengerData(updated);
  };

  const isStepValid = (step: number): boolean => {
    if (step === 1) {
      return passengerData.every(p => 
        p.firstName && p.lastName && p.dateOfBirth && p.nationality && p.email
      );
    }
    if (step === 2) {
      return paymentData.cardNumber && paymentData.expiryDate && 
             paymentData.cvv && paymentData.cardholderName;
    }
    return false;
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const bookingId = `MF-${Date.now()}`;
    onBookingComplete(bookingId);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold">Complete Your Booking</h2>
        </div>
        
        <div className="text-sm opacity-90">
          {flight.departure.airport.city} → {flight.arrival.airport.city} • {flight.flightNumber}
        </div>
        <div className="text-lg font-semibold mt-2">
          Total: €{totalPrice} for {passengers} passenger{passengers > 1 ? 's' : ''}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-center space-x-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= step 
                  ? 'bg-sky-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              <span className={`ml-2 text-sm ${
                currentStep >= step ? 'text-sky-600 font-medium' : 'text-gray-500'
              }`}>
                {step === 1 ? 'Passenger Details' : step === 2 ? 'Payment' : 'Confirmation'}
              </span>
              {step < 3 && (
                <div className={`w-16 h-px ml-4 ${
                  currentStep > step ? 'bg-sky-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Step 1: Passenger Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Passenger Information</h3>
            
            {passengerData.map((passenger, index) => (
              <div key={passenger.id} className="border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">
                  Passenger {index + 1}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <select
                      value={passenger.title}
                      onChange={(e) => updatePassenger(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Ms">Ms</option>
                      <option value="Dr">Dr</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={passenger.firstName}
                      onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={passenger.lastName}
                      onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                    <input
                      type="date"
                      value={passenger.dateOfBirth}
                      onChange={(e) => updatePassenger(index, 'dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
                    <input
                      type="text"
                      value={passenger.nationality}
                      onChange={(e) => updatePassenger(index, 'nationality', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="e.g., Dutch, German, French"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                    <input
                      type="text"
                      value={passenger.passportNumber}
                      onChange={(e) => updatePassenger(index, 'passportNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  
                  {index === 0 && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            value={passenger.email}
                            onChange={(e) => updatePassenger(index, 'email', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            value={passenger.phone}
                            onChange={(e) => updatePassenger(index, 'phone', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
            
            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!isStepValid(1)}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isStepValid(1)
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Payment Information</h3>
            
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-2 rounded-full">
                  <Lock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Secure Payment</h4>
                  <p className="text-sm text-gray-600">Your payment information is encrypted and secure</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({
                        ...paymentData,
                        cardNumber: formatCardNumber(e.target.value)
                      })}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                  <input
                    type="text"
                    value={paymentData.expiryDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.substring(0, 2) + '/' + value.substring(2, 4);
                      }
                      setPaymentData({ ...paymentData, expiryDate: value });
                    }}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                  <input
                    type="text"
                    value={paymentData.cvv}
                    onChange={(e) => setPaymentData({
                      ...paymentData,
                      cvv: e.target.value.replace(/\D/g, '').substring(0, 3)
                    })}
                    placeholder="123"
                    maxLength={3}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name *</label>
                  <input
                    type="text"
                    value={paymentData.cardholderName}
                    onChange={(e) => setPaymentData({
                      ...paymentData,
                      cardholderName: e.target.value
                    })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Back
              </button>
              
              <button
                onClick={handlePayment}
                disabled={!isStepValid(2) || isProcessing}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isStepValid(2) && !isProcessing
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  `Pay €${totalPrice}`
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};