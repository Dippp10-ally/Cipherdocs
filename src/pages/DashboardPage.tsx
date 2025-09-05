import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext.js';
import UserProfileCard from '../components/UserProfileCard';
import RecentActivity from '../components/RecentActivity';
import StatsCard from '../components/StatsCard';
import { useProfile } from '../context/ProfileContext';
import Navbar from '../components/Navbar';
import ConsentSidebar from '../components/ConsentSidebar';
import ConsentPieChart from '../components/ConsentPieChart';
import ConsentTable from '../components/ConsentTable';
import ConsentTableSkeleton from '../components/ConsentTableSkeleton';
import ConsentEmptyState from '../components/ConsentEmptyState';
import ConsentNotificationToast from '../components/ConsentNotificationToast';
import ConsentBanner from '../components/ConsentBanner';
import ConsentThemeToggle from '../components/ConsentThemeToggle';
import ConsentHelpTooltip from '../components/ConsentHelpTooltip';
import ConsentExportButton from '../components/ConsentExportButton';
import ConsentStatusFilter from '../components/ConsentStatusFilter';
import ConsentSearchInput from '../components/ConsentSearchInput';
import ConsentDateRangePicker from '../components/ConsentDateRangePicker';
import ConsentBulkActions from '../components/ConsentBulkActions';
import ConsentUserSelector from '../components/ConsentUserSelector';
import ConsentGrantModal from '../components/ConsentGrantModal';

// Mock Data
const mockActivities = [
  { id: '1', description: 'Granted consent for "Aadhaar Card"', timestamp: new Date() },
  { id: '2', description: 'Revoked consent for "Passport"', timestamp: new Date(Date.now() - 86400000) },
  { id: '3', description: 'Requested consent for "Bank Statement"', timestamp: new Date(Date.now() - 172800000) },
  { id: '4', description: 'Updated consent settings', timestamp: new Date(Date.now() - 259200000) },
];

const DashboardPage: React.FC = () => {
  const walletContext: any = useWallet();
  const { profile } = useProfile();

  // Mock loading and data state
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [dark, setDark] = useState(false);
  // Mock filter state
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selected, setSelected] = useState<string[]>([]);
  const [user, setUser] = useState('');
  const [showGrantModal, setShowGrantModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setRows([
        { id: '1', document: 'Aadhaar Card', user: '0x123...', status: 'granted', requestedAt: '2024-06-01' },
        { id: '2', document: 'Passport', user: '0x456...', status: 'revoked', requestedAt: '2024-05-20' },
        { id: '3', document: 'Bank Statement', user: '0x789...', status: 'requested', requestedAt: '2024-06-10' },
        { id: '4', document: 'Driving License', user: '0xabc...', status: 'granted', requestedAt: '2024-06-05' },
        { id: '5', document: 'PAN Card', user: '0xdef...', status: 'expired', requestedAt: '2024-04-15' },
      ]);
      setLoading(false);
      setShowToast(true);
    }, 1200);
  }, []);

  if (!walletContext.isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Wallet Connection Required</h2>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to access your consent dashboard and manage your data sharing permissions.
          </p>
          <button 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => walletContext.connectWallet()}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="absolute top-4 right-8 z-50">
        <ConsentThemeToggle dark={dark} onToggle={() => setDark(d => !d)} />
      </div>
      <ConsentBanner message="Welcome to your Consent Dashboard! Manage all your data sharing permissions in one place." type="info" />
      <div className="flex">
        <div className="hidden lg:block w-64">
          <ConsentSidebar links={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Consents', href: '/consents' },
            { label: 'Profile', href: '/profile' },
            { label: 'Settings', href: '/settings' },
          ]} />
        </div>
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              <ConsentHelpTooltip text="This dashboard gives you an overview of your consents, requests, and recent activity.">
                Dashboard
              </ConsentHelpTooltip>
            </h1>
            <button 
              onClick={() => setShowGrantModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
            >
              <span className="mr-2">+</span> Grant New Consent
            </button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard title="Active Consents" value={5} icon={'📄'} />
            <StatsCard title="Pending Requests" value={2} icon={'⏳'} />
            <StatsCard title="Revoked Consents" value={1} icon={'🚫'} />
            <StatsCard title="Total Documents" value={12} icon={'📁'} />
          </div>
          
          {/* Charts and User Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Consent Status Pie Chart */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Consent Status Distribution</h2>
              <ConsentPieChart granted={5} pending={2} revoked={1} />
            </div>
            
            {/* User Profile and Recent Activity */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4">Your Profile</h2>
                <UserProfileCard user={profile} />
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <RecentActivity activities={mockActivities} />
              </div>
            </div>
          </div>
          
          {/* Consent Management Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-wrap justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Manage Consents</h2>
              <div className="flex flex-wrap gap-3 items-center mt-2 md:mt-0">
                <ConsentExportButton consents={rows} />
              </div>
            </div>
            
            <div className="mb-4 flex flex-wrap gap-3 items-end">
              <ConsentStatusFilter value={status} onChange={setStatus} />
              <ConsentSearchInput value={search} onChange={setSearch} placeholder="Search consents..." />
              <ConsentDateRangePicker start={dateRange.from} end={dateRange.to} onChange={(from, to) => setDateRange({ from, to })} />
              <ConsentUserSelector value={user} onChange={setUser} users={[
                { id: "0x123...", name: "Alice" },
                { id: "0x456...", name: "Bob" },
                { id: "0x789...", name: "Charlie" },
              ]} />
              <ConsentBulkActions selected={selected} onApprove={() => {}} onRevoke={() => {}} />
            </div>
            
            {loading ? (
              <ConsentTableSkeleton />
            ) : rows.length === 0 ? (
              <ConsentEmptyState message="No consents found." />
            ) : (
              <ConsentTable rows={rows} />
            )}
          </div>
        </main>
      </div>
      
      {/* Grant Consent Modal */}
      <ConsentGrantModal 
        open={showGrantModal}
        onClose={() => setShowGrantModal(false)}
        onGrant={() => {
          console.log('Granting consent');
          setShowGrantModal(false);
        }}
      />
      
      <ConsentNotificationToast
        message="Consent data loaded successfully!"
        type="success"
        onClose={() => setShowToast(false)}
        {...(showToast ? {} : { style: { display: 'none' } })}
      />
    </div>
  );
};

export default DashboardPage;