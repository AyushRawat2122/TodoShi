import React, { useState, useEffect, useMemo } from 'react';
import { FaSearch } from 'react-icons/fa';
import InviteListItem from './InviteListItem';
import Loader from './Loader';

/**
 * Search panel for finding and inviting users to a project
 */
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

    const timeoutId = setTimeout(() => {
      setIsSearching(true);
      
      // TODO: Replace with actual API call
      // Example:
      // const searchUsers = async () => {
      //   try {
      //     const response = await fetch(`/api/users/search?q=${searchQuery}`);
      //     const data = await response.json();
      //     setSearchResults(data);
      //   } catch (error) {
      //     console.error('Error searching users:', error);
      //   } finally {
      //     setIsSearching(false);
      //   }
      // };
      // searchUsers();

      // Mock search results
      setTimeout(() => {
        const mockResults = [
          { userId: 'u1', name: 'John Doe', username: 'johndoe', email: 'john@example.com' },
          { userId: 'u2', name: 'Jane Smith', username: 'janesmith', email: 'jane@example.com' },
          { userId: 'u3', name: 'Alex Johnson', username: 'alexj', email: 'alex@example.com' }
        ].filter(user => 
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setSearchResults(mockResults);
        setIsSearching(false);
      }, 500);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle inviting a user
  const handleInviteUser = async (user) => {
    setInvitingUserIds(prev => [...prev, user.userId]);
    
    try {
      await onInviteUser(user);
    } finally {
      setInvitingUserIds(prev => prev.filter(id => id !== user.userId));
    }
  };

  return (
    <div className="mt-6 bg-white dark:bg-[#13111d]/50 border border-gray-200 dark:border-[#2a283a] rounded-xl overflow-hidden shadow-sm">
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
        {isSearching ? (
          <div className="py-8 text-center">
            <Loader className="w-6 h-6 mx-auto text-[#6229b3]" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Searching users...</p>
          </div>
        ) : searchQuery.length < 2 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            <p>Enter at least 2 characters to search users</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            <p>No users found matching "{searchQuery}"</p>
          </div>
        ) : (
          searchResults.map(user => (
            <InviteListItem
              key={user.userId}
              user={user}
              onInvite={handleInviteUser}
              loading={invitingUserIds.includes(user.userId)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SearchInvitePanel;
