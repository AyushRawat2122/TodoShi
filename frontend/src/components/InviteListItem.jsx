import React, { memo } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import UserAvatar from './UserAvatar';
import Loader from './Loader';

const InviteListItem = memo(({ user, onInvite, loading }) => (
  <motion.div
    whileHover={{ backgroundColor: 'rgba(98, 41, 179, 0.05)' }}
    transition={{ duration: 0.2 }}
    className="py-3 px-4 border-b border-gray-200 dark:border-[#2a283a] flex items-center justify-between"
  >
    <div className="flex items-center gap-3">
      <UserAvatar user={user} />
      <div>
        <div className="font-medium text-gray-900 dark:text-purple-100">
          {user.username || 'Unknown User'}
        </div>
      </div>
    </div>

    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onInvite(user)}
      disabled={loading}
      className="px-3 py-1.5 bg-[#6229b3] dark:bg-[#8236ec] text-white rounded-md hover:bg-[#4c1f8e] dark:hover:bg-[#6229b3] transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader className="w-4 h-4" />
          <span>Sending...</span>
        </>
      ) : (
        <>
          <FaUserPlus />
          <span>Invite</span>
        </>
      )}
    </motion.button>
  </motion.div>
));

export default InviteListItem;
