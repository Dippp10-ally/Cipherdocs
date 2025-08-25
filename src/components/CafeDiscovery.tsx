import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Cafe {
  id: string;
  name: string;
  location: string;
  email: string;
  code: string;
  qrCode: string;
  verified: boolean;
  rating: number;
  distance?: string;
  operator: string;
  status: 'online' | 'offline' | 'busy';
}

interface CafeDiscoveryProps {
  onCafeSelected: (cafe: Cafe) => void;
  onClose: () => void;
}

const CafeDiscovery: React.FC<CafeDiscoveryProps> = ({ onCafeSelected, onClose }) => {
  const [searchMethod, setSearchMethod] = useState<'scan' | 'code' | 'email' | 'nearby'>('nearby');
  const [searchInput, setSearchInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [foundCafes, setFoundCafes] = useState<Cafe[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);

  // Mock café data - in production, this would come from a blockchain/database
  const nearbyCafes: Cafe[] = [
    {
      id: 'cafe_001',
      name: 'Cyber Café - Pune',
      location: 'FC Road, Pune, Maharashtra',
      email: 'pune.fc@cybercafe.in',
      code: 'PUNE001',
      qrCode: 'CC_PUNE_001_QR',
      verified: true,
      rating: 4.5,
      distance: '0.5 km',
      operator: 'Rajesh Patil',
      status: 'online'
    },
    {
      id: 'cafe_002',
      name: 'Digital Hub Café',
      location: 'Camp Area, Pune, Maharashtra',
      email: 'camp.hub@digitalhub.co.in',
      code: 'PUNE002',
      qrCode: 'DH_PUNE_002_QR',
      verified: true,
      rating: 4.2,
      distance: '1.2 km',
      operator: 'Priya Kulkarni',
      status: 'online'
    },
    {
      id: 'cafe_003',
      name: 'Tech Point Internet',
      location: 'Kothrud, Pune, Maharashtra',
      email: 'tech@techpoint.net.in',
      code: 'PUNE003',
      qrCode: 'TP_PUNE_003_QR',
      verified: false,
      rating: 3.8,
      distance: '2.1 km',
      operator: 'Amit Deshmukh',
      status: 'busy'
    },
    {
      id: 'cafe_004',
      name: 'Connect Zone',
      location: 'Deccan Gymkhana, Pune, Maharashtra',
      email: 'connect@zonecafe.org',
      code: 'PUNE004',
      qrCode: 'CZ_PUNE_004_QR',
      verified: true,
      rating: 4.7,
      distance: '0.8 km',
      operator: 'Sunita Joshi',
      status: 'online'
    },
    {
      id: 'cafe_005',
      name: 'Maharashtra Connect Center',
      location: 'Shivaji Nagar, Pune, Maharashtra',
      email: 'pune@connectcenter.gov.in',
      code: 'PUNE005',
      qrCode: 'MC_PUNE_005_QR',
      verified: true,
      rating: 4.3,
      distance: '3.5 km',
      operator: 'Govt. Center MH',
      status: 'offline'
    }
  ];

  useEffect(() => {
    // Load nearby cafés by default
    setFoundCafes(nearbyCafes);
  }, []);

  const handleSearch = () => {
    let results: Cafe[] = [];
    
    switch (searchMethod) {
      case 'code':
        results = nearbyCafes.filter(cafe => 
          cafe.code.toLowerCase().includes(searchInput.toLowerCase())
        );
        break;
      case 'email':
        results = nearbyCafes.filter(cafe => 
          cafe.email.toLowerCase().includes(searchInput.toLowerCase())
        );
        break;
      case 'scan':
        // Simulate QR scan result
        results = nearbyCafes.filter(cafe => 
          cafe.qrCode.toLowerCase().includes(searchInput.toLowerCase())
        );
        break;
      default:
        results = nearbyCafes;
    }
    
    setFoundCafes(results);
  };

  const handleQRScan = () => {
    setScanning(true);
    // Simulate QR code scanning
    setTimeout(() => {
      const randomCafe = nearbyCafes[Math.floor(Math.random() * nearbyCafes.length)];
      setSearchInput(randomCafe.qrCode);
      setFoundCafes([randomCafe]);
      setScanning(false);
    }, 2000);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 border-green-200';
      case 'offline': return 'bg-red-100 text-red-800 border-red-200';
      case 'busy': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return '●';
      case 'offline': return '●';
      case 'busy': return '●';
      default: return '●';
    }
  };

  const getStatusIconColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'offline': return 'text-red-500';
      case 'busy': return 'text-yellow-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Select Service Location</h2>
              <p className="text-blue-100">Connect to a verified café near you</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Methods */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <button
              onClick={() => setSearchMethod('nearby')}
              className={`p-3 rounded-lg text-center transition-all ${
                searchMethod === 'nearby' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="text-2xl mb-1"></div>
              <div className="text-sm font-medium">Nearby</div>
            </button>
            
            <button
              onClick={() => setSearchMethod('scan')}
              className={`p-3 rounded-lg text-center transition-all ${
                searchMethod === 'scan' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="text-2xl mb-1">□</div>
              <div className="text-sm font-medium">Scan QR</div>
            </button>
            
            <button
              onClick={() => setSearchMethod('code')}
              className={`p-3 rounded-lg text-center transition-all ${
                searchMethod === 'code' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="text-2xl mb-1">#</div>
              <div className="text-sm font-medium">Café Code</div>
            </button>
            
            <button
              onClick={() => setSearchMethod('email')}
              className={`p-3 rounded-lg text-center transition-all ${
                searchMethod === 'email' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="text-2xl mb-1">@</div>
              <div className="text-sm font-medium">Email</div>
            </button>
          </div>

          {/* Search Input */}
          {searchMethod !== 'nearby' && (
            <div className="flex space-x-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={
                  searchMethod === 'scan' ? 'QR Code will appear here...' :
                  searchMethod === 'code' ? 'Enter café code (e.g., PUNE001)' :
                  'Enter café email address'
                }
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={searchMethod === 'scan'}
              />
              
              {searchMethod === 'scan' ? (
                <button
                  onClick={handleQRScan}
                  disabled={scanning}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {scanning ? 'Scanning...' : 'Scan QR'}
                </button>
              ) : (
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                >
                  Search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Café List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              {searchMethod === 'nearby' ? 'Nearby Cafés' : 'Search Results'} ({foundCafes.length})
            </h3>
          </div>
          
          <div className="space-y-4">
            {foundCafes.map((cafe) => (
              <motion.div
                key={cafe.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 border rounded-xl transition-all cursor-pointer ${
                  selectedCafe?.id === cafe.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedCafe(cafe)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {cafe.name.charAt(0)}
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-800">{cafe.name}</h4>
                        {cafe.verified && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            ✓ Verified
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(cafe.status)}`}>
                          <span className={getStatusIconColor(cafe.status)}>{getStatusIcon(cafe.status)}</span> {cafe.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600">{cafe.location}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span>Email: {cafe.email}</span>
                        <span>Code: {cafe.code}</span>
                        {cafe.distance && <span>Distance: {cafe.distance}</span>}
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < Math.floor(cafe.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                              *
                            </span>
                          ))}
                          <span className="text-sm text-gray-600 ml-1">{cafe.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500">• Operator: {cafe.operator}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {cafe.status === 'online' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCafeSelected(cafe);
                        }}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                      >
                        Connect
                      </button>
                    ) : (
                      <div className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg font-medium">
                        {cafe.status === 'offline' ? 'Offline' : 'Busy'}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {foundCafes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 text-gray-400">□</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No cafés found</h3>
              <p className="text-gray-500">Try a different search method or check your input</p>
            </div>
          )}
        </div>

        {/* Selected Café Actions */}
        {selectedCafe && (
          <div className="p-6 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Selected: {selectedCafe.name}</h4>
                <p className="text-sm text-gray-600">{selectedCafe.location}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedCafe(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onCafeSelected(selectedCafe)}
                  disabled={selectedCafe.status !== 'online'}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Connect to Café
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CafeDiscovery;