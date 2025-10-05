import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaUserPlus, FaTimes, FaEllipsisV, FaUser } from 'react-icons/fa';
import { BiX } from 'react-icons/bi';
import { useProject } from '../store/project';
import useUser from '../hooks/useUser';
import Loader from '../components/Loader';
import UserAvatar from '../components/UserAvatar';
import SearchInvitePanel from '../components/SearchInvitePanel';
import serverRequest from '../utils/axios';

// Memoized components to prevent unnecessary re-renders
const TabNavigation = memo(({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="flex mb-6 border-b border-gray-200 dark:border-[#2a283a] overflow-x-auto no-scrollbar">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex-shrink-0 ${activeTab === tab.id
            ? 'border-b-2 border-[#6229b3] text-[#6229b3] dark:border-[#c2a7fb] dark:text-[#c2a7fb]'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
        >
          {tab.label} {tab.count !== undefined && `(${tab.count})`}
        </button>
      ))}
    </div>
  );
});

// Search input component
const SearchBar = memo(({ value, onChange }) => {
  return (
    <div className="relative mb-6">
      <input
        type="text"
        placeholder="Search collaborators..."
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-[#2a283a] rounded-lg bg-white dark:bg-[#13111d] text-gray-800 dark:text-purple-100 focus:outline-none focus:ring-1 focus:ring-[#6229b3] focus:border-transparent"
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
    </div>
  );
});

// Request Tab Component with its own fetch logic
const RequestsTab = memo(({ projectId, status, searchQuery, onCountUpdate }) => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch requests for this specific tab
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      console.log('RequestsTab - Fetching requests for project:', projectId, 'status:', status);
      
      try {
        const response = await serverRequest.get(
          `/collaborators/get-outgoing-requests/${projectId}`
        );

        console.log('RequestsTab - Fetch Response:', response.data);

        if (response.data.success) {
          console.log('RequestsTab - All Requests:', response.data.data);
          
          // Filter by status
          const filteredRequests = response.data.data.filter(req => {
            if (status === 'pending') return req.status === 'pending';
            if (status === 'rejected') return req.status === 'rejected';
            return true;
          });
          
          console.log('RequestsTab - Filtered Requests:', filteredRequests);
          setRequests(filteredRequests);
          
          // Update count for this tab
          if (onCountUpdate) {
            onCountUpdate(status, filteredRequests.length);
          }
        }
      } catch (error) {
        console.log('Error fetching requests:', error);
        setRequests([]);
        if (onCountUpdate) {
          onCountUpdate(status, 0);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchRequests();
    }
  }, [projectId, status, onCountUpdate]);

  // Filter requests based on searchQuery
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const displayUser = request.receiverId || request.sender || {};
      return (
        displayUser.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        displayUser.username?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [requests, searchQuery]);

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <Loader className="mx-auto w-8 h-8 text-[#6229b3]" />
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading requests...</p>
      </div>
    );
  }

  if (filteredRequests.length === 0) {
    return (
      <EmptyState
        title={status === 'pending' ? "No Pending Requests" : "No Declined Requests"}
        message={status === 'pending'
          ? "There are no pending collaboration requests."
          : "There are no declined collaboration requests."}
      />
    );
  }

  return (
    <>
      {filteredRequests.map(request => (
        <RequestRow key={request._id} request={request} />
      ))}
    </>
  );
});

// Empty state component
const EmptyState = memo(({ title, message, actionButton = null }) => {
  return (
    <div className="text-center py-16">
      <FaUser className="mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-4" />
      <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">{message}</p>
      {actionButton}
    </div>
  );
});

// Confirm Modal - Memoized for better performance
const ConfirmModal = memo(({ isOpen, onClose, onConfirm, title, message, confirmText, loading }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-[#13111d] rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-purple-100 mb-3">
                {title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {message}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-[#2a283a] rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a283a]/70"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    confirmText || "Confirm"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// CollaboratorRow component - Memoized
const CollaboratorRow = memo(({ collaborator, isOwner, currentUserId, onRemove }) => {
  const isCurrentUser = collaborator.userId === currentUserId || collaborator._id === currentUserId;
  const isProjectOwner = collaborator.role === 'owner' || collaborator.isOwner;
  const canManage = isOwner && !isProjectOwner && !isCurrentUser;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
  };

  return (
    <div className="py-4 px-4 border-b border-gray-200 dark:border-[#2a283a] flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#2a283a]/30 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <UserAvatar user={collaborator} />
        <div className="min-w-0">
          <div className="font-medium text-gray-900 dark:text-purple-100 flex items-center gap-2 flex-wrap">
            <span className="truncate">{collaborator.username || 'Unknown User'}</span>
            {isProjectOwner && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 whitespace-nowrap">
                Owner
              </span>
            )}
            {isCurrentUser && <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">(You)</span>}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:hidden">
            {isProjectOwner ? 'Project Owner' : `Joined ${formatDate(collaborator.joinedAt || collaborator.createdAt)}`}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap hidden sm:block">
          {isProjectOwner ? 'Project Owner' : `Joined ${formatDate(collaborator.joinedAt || collaborator.createdAt)}`}
        </div>

        {canManage && (
          <button
            onClick={() => onRemove(collaborator)}
            className="px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 border-2 border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-.5 whitespace-nowrap"
          >
            <BiX className="" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        )}
      </div>
    </div>
  );
});

// RequestRow component - Memoized
const RequestRow = memo(({ request }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
  };

  // For outgoing requests, we display the receiver (person being invited)
  const displayUser = request.receiverId || request.sender || {};

  return (
    <div className="py-4 px-4 border-b border-gray-200 dark:border-[#2a283a] flex items-center justify-between">
      <div className="flex items-center gap-3">
        <UserAvatar user={displayUser} />
        <div>
          <div className="font-medium text-gray-900 dark:text-purple-100">
            {displayUser.username || 'Unknown User'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${request.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}>
          {request.status === 'pending' ? 'Pending' : 'Declined'}
        </span>

        <div className="text-sm text-gray-500 dark:text-gray-400 min-w-24 text-right">
          {`Sent ${formatDate(request.createdAt)}`}
        </div>
      </div>
    </div>
  );
});

// Main component
export default function Collaborators() {
  const { projectId } = useParams();
  const { isOwner, collaborators, setCollaborators } = useProject();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [isLoadingCollaborators, setIsLoadingCollaborators] = useState(true);
  const [projectOwner, setProjectOwner] = useState(null);
  const [requestCounts, setRequestCounts] = useState({ pending: 0, rejected: 0 });

  // Fetch collaborators on component mount
  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        setIsLoadingCollaborators(true);
        console.log('Collaborators - Fetching for project:', projectId);
        
        const response = await serverRequest.get(
          `/collaborators/get-collaborators/${projectId}`
        );
        
        console.log('Collaborators - Fetch Response:', response.data);
        
        if (response.data.success) {
          console.log('Collaborators - Data:', response.data.data);
          
          // Set project owner
          if (response.data.data.createdBy) {
            setProjectOwner(response.data.data.createdBy);
          }
          
          // Set collaborators
          setCollaborators(response.data.data.collaborators || []);
        }
      } catch (error) {
        console.log('Error fetching collaborators:', error);
      } finally {
        setIsLoadingCollaborators(false);
      }
    };

    if (projectId) {
      fetchCollaborators();
    }
  }, [projectId, setCollaborators]);

  // Fetch initial counts for pending and rejected tabs
  useEffect(() => {
    const fetchRequestCounts = async () => {
      if (!projectId || !isOwner) return;

      try {
        const response = await serverRequest.get(
          `/collaborators/get-outgoing-requests/${projectId}`
        );

        if (response.data.success) {
          const allRequests = response.data.data || [];
          const pendingCount = allRequests.filter(req => req.status === 'pending').length;
          const rejectedCount = allRequests.filter(req => req.status === 'rejected').length;
          
          setRequestCounts({
            pending: pendingCount,
            rejected: rejectedCount
          });
        }
      } catch (error) {
        console.log('Error fetching request counts:', error);
      }
    };

    fetchRequestCounts();
  }, [projectId, isOwner]);

  // Reset to active tab if current tab is not allowed for non-owners
  useEffect(() => {
    if (!isOwner && activeTab !== 'active') {
      setActiveTab('active');
    }
  }, [isOwner, activeTab]);

  // Handle count updates from RequestsTab (when data changes)
  const handleCountUpdate = useCallback((status, count) => {
    setRequestCounts(prev => ({ ...prev, [status]: count }));
  }, []);

  // Generate tabs based on ownership status - Memoized
  const tabs = useMemo(() => {
    const totalMembers = (projectOwner ? 1 : 0) + collaborators.length;
    const baseTabs = [
      { id: 'active', label: 'Active Collaborators', count: totalMembers },
    ];

    if (isOwner) {
      return [
        ...baseTabs,
        { id: 'pending', label: 'Pending Requests' },
        { id: 'rejected', label: 'Declined Requests' },
      ];
    }

    return baseTabs;
  }, [isOwner, collaborators, projectOwner]);

  // Filter collaborators based on userId and name only
  const filteredCollaborators = useMemo(() => {
    const allMembers = [];
    
    // Add owner first if exists
    if (projectOwner) {
      allMembers.push({
        ...projectOwner,
        role: 'owner',
        isOwner: true
      });
    }
    
    // Add collaborators
    collaborators.forEach(collab => {
      allMembers.push({
        ...collab,
        role: 'member',
        isOwner: false
      });
    });
    
    // Filter based on search
    return allMembers.filter(member => {
      const search = searchQuery.toLowerCase();
      return (
        member.name?.toLowerCase().includes(search) ||
        member.username?.toLowerCase().includes(search)
      );
    });
  }, [collaborators, projectOwner, searchQuery]);

  const handleRemove = useCallback((collaborator) => {
    if (!isOwner) return;
    setSelectedCollaborator(collaborator);
    setIsConfirmModalOpen(true);
  }, [isOwner]);

  const handleConfirmRemove = useCallback(async () => {
    if (!isOwner || !selectedCollaborator) return;

    console.log('Collaborators - Removing collaborator:', selectedCollaborator, 'from project:', projectId);
    setLoading(true);
    try {
      const response = await serverRequest.delete(
        `/collaborators/remove-collaborator/${selectedCollaborator._id}/${projectId}`
      );

      console.log('Collaborators - Remove Response:', response.data);

      if (response.data.success) {
        setCollaborators(prev => prev.filter(c => c._id !== selectedCollaborator._id));
        setIsConfirmModalOpen(false);
        setSelectedCollaborator(null);
      }
    } catch (error) {
      console.log('Error removing collaborator:', error);
    } finally {
      setLoading(false);
    }
  }, [isOwner, selectedCollaborator, setCollaborators, projectId]);

  // Memoized action button for empty state
  const emptyStateActionButton = useMemo(() => {
    if (isOwner && activeTab === 'active') {
      return (
        <button
          onClick={() => setShowSearchPanel(true)}
          className="mt-6 px-4 py-2 bg-[#6229b3] dark:bg-[#8236ec] text-white rounded-md hover:bg-[#4c1f8e] dark:hover:bg-[#6229b3] flex items-center gap-2 mx-auto"
        >
          <FaUserPlus />
          <span>Find Collaborators</span>
        </button>
      );
    }
    return null;
  }, [isOwner, activeTab]);

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-purple-100">Project Collaborators</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-purple-200/70 mt-1">
              {isOwner
                ? "Manage team members and monitor collaboration requests"
                : "View team members working on this project"}
            </p>
          </div>

          {isOwner && (
            <button
              onClick={() => setShowSearchPanel(prev => !prev)}
              className="px-4 py-2 bg-[#6229b3] dark:bg-[#8236ec] text-white rounded-md hover:bg-[#4c1f8e] dark:hover:bg-[#6229b3] transition-colors flex items-center gap-2"
            >
              <FaSearch />
              <span>{showSearchPanel ? "Hide Search" : "Find Users"}</span>
            </button>
          )}
        </div>

        {/* User Search Panel (only visible when search button is clicked) */}
        {isOwner && showSearchPanel && (
          <SearchInvitePanel 
            projectId={projectId}
          />
        )}

        {/* Search bar for filtering existing collaborators */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* Tab navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

        {/* Content based on active tab */}
        <div className="bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/10 dark:to-transparent border border-gray-200 dark:border-[#2a283a] rounded-xl overflow-hidden shadow-sm">
          {isLoadingCollaborators ? (
            <div className="py-16 text-center">
              <Loader className="mx-auto w-8 h-8 text-[#6229b3]" />
              <p className="mt-4 text-gray-500 dark:text-gray-400">Loading collaborators...</p>
            </div>
          ) : activeTab === 'active' ? (
            filteredCollaborators.length > 0 ? (
              filteredCollaborators.map(collaborator => (
                <CollaboratorRow
                  key={collaborator._id}
                  collaborator={collaborator}
                  isOwner={isOwner}
                  currentUserId={user?.data?._id}
                  onRemove={handleRemove}
                />
              ))
            ) : (
              <EmptyState
                title="No Active Collaborators"
                message="There are no active collaborators on this project yet."
                actionButton={emptyStateActionButton}
              />
            )
          ) : (
            <RequestsTab
              projectId={projectId}
              status={activeTab}
              searchQuery={searchQuery}
              onCountUpdate={handleCountUpdate}
            />
          )}
        </div>
      </div>

      {/* Modals - Only render if user is owner */}
      {isOwner && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmRemove}
          title="Remove Collaborator"
          message={`Are you sure you want to remove ${selectedCollaborator?.name || selectedCollaborator?.username || 'this collaborator'} from the project?`}
          confirmText="Remove"
          loading={loading}
        />
      )}
    </div>
  );
}