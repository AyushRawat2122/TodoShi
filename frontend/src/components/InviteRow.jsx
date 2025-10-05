import React, { memo } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Loader from './Loader';
import UserAvatar from './UserAvatar';

const InviteRow = memo(({ invite, onAccept, onReject, loading }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ backgroundColor: 'rgba(98, 41, 179, 0.03)' }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-6 gap-4 py-4 px-4 border-b border-gray-200 dark:border-[#2a283a] items-center"
    >
      {/* Project */}
      <div className="col-span-1">
        <div className="font-medium text-gray-900 dark:text-purple-100 truncate">
          {invite.projectId?.title || 'Unknown Project'}
        </div>
      </div>

      {/* Invited By */}
      <div className="col-span-1 flex items-center gap-2">
        <UserAvatar user={invite.senderId || {}} />
        <div className="truncate">
          <div className="text-sm font-medium text-gray-900 dark:text-purple-100">
            {invite.senderId?.username || 'Unknown'}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="col-span-1">
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(invite.status)}`}
        >
          {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
        </motion.span>
      </div>

      {/* Sent Date */}
      <div className="col-span-1 text-sm text-gray-500 dark:text-gray-400">
        {formatDate(invite.createdAt)}
      </div>

      {/* Actions */}
      <div className="col-span-2 flex justify-end gap-2">
        {invite.status === 'pending' && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAccept(invite)}
              disabled={loading}
              className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FaCheck />
                  <span>Accept</span>
                </>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onReject(invite)}
              disabled={loading}
              className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FaTimes />
                  <span>Reject</span>
                </>
              )}
            </motion.button>
          </>
        )}
        {invite.status === 'accepted' && (
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-green-600 dark:text-green-400 font-medium"
          >
            ✓ Accepted
          </motion.span>
        )}
        {invite.status === 'rejected' && (
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-red-600 dark:text-red-400 font-medium"
          >
            ✗ Rejected
          </motion.span>
        )}
      </div>
    </motion.div>
  );
});

export default InviteRow;
