import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiRefreshCw } from 'react-icons/fi';
import InviteRow from '../components/InviteRow';
import Loader from '../components/Loader';
import useUser from '../hooks/useUser';
import serverRequest from '../utils/axios';

const MyInvites = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [invites, setInvites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useUser();

  // Fetch invites on mount
  useEffect(() => {
    const fetchInvites = async () => {
      if (!user?.data?._id) return;
      
      setIsLoading(true);
      try {
        const response = await serverRequest.get(`/requests/get-requests/${user.data._id}`);
        
        console.log('MyInvites - Fetch Response:', response.data);
        
        if (response.data.success) {
          console.log('MyInvites - Invites Data:', response.data.data);
          setInvites(response.data.data || []);
        }
      } catch (error) {
        console.log('Error fetching invites:', error);
        setInvites([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvites();
  }, [user?.data?._id]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    if (!user?.data?._id || isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      const response = await serverRequest.get(`/requests/get-requests/${user.data._id}`);
      
      if (response.data.success) {
        setInvites(response.data.data || []);
      }
    } catch (error) {
      console.log('Error refreshing invites:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [user?.data?._id, isRefreshing]);

  // Filter invites by status
  const filteredInvites = useMemo(() => {
    return invites.filter(invite => invite.status === activeTab);
  }, [invites, activeTab]);

  // Handle accept invite
  const handleAccept = useCallback(async (invite) => {
    if (!user?.data?._id) return;
    
    console.log('MyInvites - Accepting invite:', invite);
    setActionLoading(invite._id);
    
    try {
      const response = await serverRequest.patch(
        `/requests/accept-request/${invite._id}/${user.data._id}`
      );

      console.log('MyInvites - Accept Response:', response.data);

      if (response.data.success) {
        setInvites(prev => prev.map(inv => 
          inv._id === invite._id ? { ...inv, status: 'accepted' } : inv
        ));
        console.log('Invitation accepted successfully');
      }
    } catch (error) {
      console.log('Error accepting invite:', error.response?.data?.message || error.message);
    } finally {
      setActionLoading(null);
    }
  }, [user?.data?._id]);

  // Handle reject invite
  const handleReject = useCallback(async (invite) => {
    if (!user?.data?._id) return;
    
    console.log('MyInvites - Rejecting invite:', invite);
    setActionLoading(invite._id);
    
    try {
      const response = await serverRequest.patch(
        `/requests/reject-request/${invite._id}/${user.data._id}`
      );

      console.log('MyInvites - Reject Response:', response.data);

      if (response.data.success) {
        setInvites(prev => prev.map(inv => 
          inv._id === invite._id ? { ...inv, status: 'rejected' } : inv
        ));
        console.log('Invitation rejected');
      }
    } catch (error) {
      console.log('Error rejecting invite:', error.response?.data?.message || error.message);
    } finally {
      setActionLoading(null);
    }
  }, [user?.data?._id]);

  const tabs = [
    { id: 'pending', label: 'Pending', count: invites.filter(i => i.status === 'pending').length },
    { id: 'accepted', label: 'Accepted', count: invites.filter(i => i.status === 'accepted').length },
    { id: 'rejected', label: 'Rejected', count: invites.filter(i => i.status === 'rejected').length }
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-purple-100">Invites</h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage incoming invites. Use the tabs to view pending, accepted, or rejected requests.
          </p>
        </div>

        {/* Tabs with Refresh Button */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-gray-200 dark:border-[#2a283a]">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-gray-900 dark:border-purple-100 text-gray-900 dark:text-purple-100'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-purple-100'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="ml-1.5 sm:ml-2 inline-flex items-center justify-center px-1.5 sm:px-2 py-0.5 text-xs font-bold leading-none text-white bg-purple-600 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className={`ml-2 sm:ml-4 flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#1f1b31] hover:bg-gray-200 dark:hover:bg-[#2a283a] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isRefreshing ? 'animate-pulse' : ''
            }`}
          >
            <FiRefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#13111d]/50 border border-gray-200 dark:border-[#2a283a] rounded-lg sm:rounded-xl overflow-hidden shadow-sm">
          {/* Table Header - Hidden on mobile */}
          <div className="hidden sm:grid grid-cols-6 gap-4 py-3 px-4 bg-gray-50 dark:bg-[#1f1b31]/50 border-b border-gray-200 dark:border-[#2a283a]">
            <div className="col-span-1 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Project
            </div>
            <div className="col-span-1 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Invited By
            </div>
            <div className="col-span-1 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Status
            </div>
            <div className="col-span-1 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Sent
            </div>
            <div className="col-span-2 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-right">
              Actions
            </div>
          </div>

          {/* Table Body */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 sm:py-16 text-center"
              >
                <Loader className="mx-auto w-6 h-6 sm:w-8 sm:h-8 text-[#6229b3]" />
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400">Loading invites...</p>
              </motion.div>
            ) : filteredInvites.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-12 sm:py-16 text-center px-4"
              >
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  No {activeTab} invites found
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="invites"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AnimatePresence>
                  {filteredInvites.map((invite, index) => (
                    <InviteRow
                      key={invite._id}
                      invite={invite}
                      onAccept={handleAccept}
                      onReject={handleReject}
                      loading={actionLoading === invite._id}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MyInvites;