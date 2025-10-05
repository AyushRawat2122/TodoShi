import React, { memo } from 'react';
import UserAvatar from './UserAvatar';

/**
 * InviteListItem component for displaying a user in search results with invite action
 * Used in search panels to show users that can be invited to the project
 * 
 * @param {Object} user - User object with name, email, etc.
 * @param {Function} onInvite - Function to call when inviting user
 * @param {boolean} loading - Whether invitation is in progress for this user
 */
const InviteListItem = memo(({ user, onInvite, loading }) => (
  <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200 dark:border-[#2a283a] hover:bg-gray-50 dark:hover:bg-[#1f1b31]/30 transition-colors">
    <div className="flex items-center gap-3">
      <UserAvatar user={user} />
      <div>
        <div className="font-medium text-gray-900 dark:text-purple-100">{user.name || user.username}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
      </div>
    </div>
    <button
      className="px-3 py-1.5 bg-[#6229b3] text-white text-sm rounded-md hover:bg-[#4c1f8e] disabled:bg-[#a78bfa] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6229b3]/50"
      onClick={() => onInvite(user)}
      disabled={loading}
    >
      {loading ? "Inviting..." : "Invite"}
    </button>
  </div>
));

export default InviteListItem;
