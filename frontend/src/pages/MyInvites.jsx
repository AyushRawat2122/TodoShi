import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import InviteRow from '../components/InviteRow';
import Loader from '../components/Loader';

const MyInvites = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [invites, setInvites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch invites on mount
  useEffect(() => {
    const fetchInvites = async () => {
      setIsLoading(true);
      
      // TODO: API call to fetch invites
      // Example:
      // try {
      //   const response = await fetch('/api/invites');
      //   const data = await response.json();
      //   setInvites(data);
      // } catch (error) {
      //   console.error('Error fetching invites:', error);
      // } finally {
      //   setIsLoading(false);
      // }

      // Mock data for demonstration
      setTimeout(() => {
        setInvites([
          {
            _id: '1',
            email: 'alex@acme.com',
            role: 'admin',
            status: 'pending',
            invitedBy: 'You',
            sentAt: '2025-09-14',
            projectId: 'proj1',
            projectName: 'Project Alpha'
          },
          {
            _id: '2',
            email: 'jane@example.com',
            role: 'member',
            status: 'accepted',
            invitedBy: 'John Doe',
            sentAt: '2025-09-10',
            projectId: 'proj2',
            projectName: 'Project Beta'
          },
          {
            _id: '3',
            email: 'bob@example.com',
            role: 'viewer',
            status: 'rejected',
            invitedBy: 'Sarah Smith',
            sentAt: '2025-09-08',
            projectId: 'proj3',
            projectName: 'Project Gamma'
          }
        ]);
        setIsLoading(false);
      }, 1000);
    };

    fetchInvites();
  }, []);

  // Filter invites by status
  const filteredInvites = useMemo(() => {
    return invites.filter(invite => invite.status === activeTab);
  }, [invites, activeTab]);

  // Handle accept invite
  const handleAccept = useCallback(async (invite) => {
    setActionLoading(invite._id);
    
    // TODO: API call to accept invite
    // Example:
    // try {
    //   await fetch(`/api/invites/${invite._id}/accept`, { method: 'POST' });
    //   setInvites(prev => prev.map(inv => 
    //     inv._id === invite._id ? { ...inv, status: 'accepted' } : inv
    //   ));
    // } catch (error) {
    //   console.error('Error accepting invite:', error);
    // } finally {
    //   setActionLoading(null);
    // }

    // Mock for demonstration
    setTimeout(() => {
      setInvites(prev => prev.map(inv => 
        inv._id === invite._id ? { ...inv, status: 'accepted' } : inv
      ));
      setActionLoading(null);
    }, 800);
  }, []);

  // Handle reject invite
  const handleReject = useCallback(async (invite) => {
    setActionLoading(invite._id);
    
    // TODO: API call to reject invite
    // Example:
    // try {
    //   await fetch(`/api/invites/${invite._id}/reject`, { method: 'POST' });
    //   setInvites(prev => prev.map(inv => 
    //     inv._id === invite._id ? { ...inv, status: 'rejected' } : inv
    //   ));
    // } catch (error) {
    //   console.error('Error rejecting invite:', error);
    // } finally {
    //   setActionLoading(null);
    // }

    // Mock for demonstration
    setTimeout(() => {
      setInvites(prev => prev.map(inv => 
        inv._id === invite._id ? { ...inv, status: 'rejected' } : inv
      ));
      setActionLoading(null);
    }, 800);
  }, []);

  const tabs = [
    { id: 'pending', label: 'Pending', count: invites.filter(i => i.status === 'pending').length },
    { id: 'accepted', label: 'Accepted', count: invites.filter(i => i.status === 'accepted').length },
    { id: 'rejected', label: 'Rejected', count: invites.filter(i => i.status === 'rejected').length }
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-purple-100">Invites</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage incoming invites. Use the tabs to view pending, accepted, or rejected requests.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-200 dark:border-[#2a283a] overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-gray-900 dark:border-purple-100 text-gray-900 dark:text-purple-100'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-purple-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#13111d]/50 border border-gray-200 dark:border-[#2a283a] rounded-xl overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 py-3 px-4 bg-gray-50 dark:bg-[#1f1b31]/50 border-b border-gray-200 dark:border-[#2a283a]">
            <div className="col-span-1 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Email
            </div>
            <div className="col-span-1 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Role
            </div>
            <div className="col-span-1 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Status
            </div>
            <div className="col-span-1 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Invited by
            </div>
            <div className="col-span-1 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Sent
            </div>
            <div className="col-span-1 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-right">
              Actions
            </div>
          </div>

          {/* Table Body */}
          {isLoading ? (
            <div className="py-16 text-center">
              <Loader className="mx-auto w-8 h-8 text-[#6229b3]" />
              <p className="mt-4 text-gray-500 dark:text-gray-400">Loading invites...</p>
            </div>
          ) : filteredInvites.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No {activeTab} invites found
              </p>
            </div>
          ) : (
            filteredInvites.map(invite => (
              <InviteRow
                key={invite._id}
                invite={invite}
                onAccept={handleAccept}
                onReject={handleReject}
                loading={actionLoading === invite._id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyInvites;
