import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import InviteListItem from './InviteListItem';
import Loader from './Loader';
import serverRequest from '../utils/axios';

const SearchInvitePanel = ({ projectId, onInviteUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [invitingUserIds, setInvitingUserIds] = useState([]);

  // Search users when query changes (with debounce)
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      
      console.log('SearchInvitePanel - Searching for:', searchQuery);
      
      try {
        const response = await serverRequest.get(
          `/collaborators/search-users?query=${encodeURIComponent(searchQuery)}`
        );

        console.log('SearchInvitePanel - Search Response:', response.data);

        if (response.data.success) {
          console.log('SearchInvitePanel - Search Results:', response.data.data);
          setSearchResults(response.data.data || []);
        }
      } catch (error) {
        console.log('Error searching users:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle inviting a user
  const handleInviteUser = async (selectedUser) => {
    console.log('SearchInvitePanel - Inviting user:', selectedUser, 'to project:', projectId);
    setInvitingUserIds(prev => [...prev, selectedUser._id]);
    
    try {
      const response = await serverRequest.post(
        `/requests/send-request/${projectId}/${selectedUser._id}`
      );

      console.log('SearchInvitePanel - Invite Response:', response.data);

      if (response.data.success) {
        console.log('Collaboration request sent successfully');
        // Remove from search results after successful invite
        setSearchResults(prev => prev.filter(u => u._id !== selectedUser._id));
      }
    } catch (error) {
      console.log('Error sending request:', error.response?.data?.message || error.message);
    } finally {
      setInvitingUserIds(prev => prev.filter(id => id !== selectedUser._id));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mt-6 bg-white dark:bg-[#13111d]/50 border border-gray-200 dark:border-[#2a283a] rounded-xl overflow-hidden shadow-sm"
    >
      {/* Search input */}
      <div className="p-4 border-b border-gray-200 dark:border-[#2a283a]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-[#2a283a] rounded-lg bg-white dark:bg-[#13111d] text-gray-800 dark:text-purple-100 focus:outline-none focus:ring-1 focus:ring-[#6229b3]"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Results section */}
      <div className="max-h-64 overflow-y-auto">
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center"
            >
              <Loader className="w-6 h-6 mx-auto text-[#6229b3]" />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Searching users...</p>
            </motion.div>
          ) : searchQuery.length < 2 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center text-gray-500 dark:text-gray-400"
            >
              <p>Enter at least 2 characters to search users</p>
            </motion.div>
          ) : searchResults.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center text-gray-500 dark:text-gray-400"
            >
              <p>No users found matching "{searchQuery}"</p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnimatePresence>
                {searchResults.map((searchUser, index) => (
                  <motion.div
                    key={searchUser._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <InviteListItem
                      user={searchUser}
                      onInvite={handleInviteUser}
                      loading={invitingUserIds.includes(searchUser._id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SearchInvitePanel;