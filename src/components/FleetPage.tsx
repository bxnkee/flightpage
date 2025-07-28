import React from 'react';
import { ArrowLeft, Users, Gauge, Plane, Award, Zap, Shield } from 'lucide-react';
import { fleetData } from '../data/fleet';

interface FleetPageProps {
  onBack: () => void;
}

export const FleetPage: React.FC<FleetPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Our Fleet</h1>
              <p className="text-gray-600 mt-1">Discover our modern aircraft designed for your comfort and safety</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Modern Aircraft for Every Journey</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our carefully selected fleet combines cutting-edge technology, exceptional comfort, and proven reliability 
            to ensure your journey is safe, comfortable, and memorable.
          </p>
        </div>

        {/* Fleet Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Plane, label: 'Aircraft', value: '25+', color: 'text-sky-500' },
            { icon: Users, label: 'Passengers Served', value: '2M+', color: 'text-emerald-500' },
            { icon: Award, label: 'Safety Rating', value: '5★', color: 'text-yellow-500' },
            { icon: Shield, label: 'On-Time Performance', value: '98%', color: 'text-blue-500' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-all duration-300">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Aircraft Cards */}
        <div className="space-y-12">
          {fleetData.map((aircraft, index) => (
            <div
              key={aircraft.id}
              className={`bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={`lg:flex ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Image */}
                <div className="lg:w-1/2">
                  <div className="h-64 lg:h-full relative overflow-hidden">
                    <img
                      src={aircraft.imageUrl}
                      alt={aircraft.model}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:w-1/2 p-8 lg:p-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-sky-100 p-2 rounded-full">
                      <Plane className="h-6 w-6 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{aircraft.model}</h3>
                      <p className="text-gray-600">{aircraft.manufacturer}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">{aircraft.description}</p>

                  {/* Specifications */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-sky-500" />
                      <span className="text-sm text-gray-600">
                        <strong>{aircraft.capacity}</strong> passengers
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-emerald-500" />
                      <span className="text-sm text-gray-600">
                        <strong>{aircraft.range}</strong> range
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm text-gray-600">
                        <strong>{aircraft.specifications.cruisingSpeed}</strong> cruise
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-purple-500" />
                      <span className="text-sm text-gray-600">
                        <strong>{aircraft.specifications.maxSpeed}</strong> max speed
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Key Features</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {aircraft.features.slice(0, 4).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical Specs Button */}
                  <button className="mt-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                    View Technical Specifications
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Experience Our Fleet?</h3>
          <p className="text-xl mb-8 opacity-90">
            Book your next flight and discover the comfort and reliability of our modern aircraft
          </p>
          <button
            onClick={onBack}
            className="bg-white text-sky-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Book Your Flight Now
          </button>
        </div>
      </div>
    </div>
  );
};