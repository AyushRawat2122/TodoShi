import React, { memo } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Loader from './Loader';
import UserAvatar from './UserAvatar';
import { FiCheck, FiX, FiClock, FiCheckCircle, FiXCircle, FiFolderPlus } from 'react-icons/fi';

const InviteRow = memo(({ invite, onAccept, onReject, loading }) => {
  console.log('Rendering InviteRow for invite ID:', invite);
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      accepted: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      rejected: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
    };

    const icons = {
      pending: <FiClock className="w-3 h-3" />,
      accepted: <FiCheckCircle className="w-3 h-3" />,
      rejected: <FiXCircle className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border-b border-gray-200 dark:border-[#2a283a] last:border-b-0"
    >
      {/* Desktop Layout */}
      <div className="hidden sm:grid grid-cols-6 gap-4 py-4 px-4 hover:bg-gray-50 dark:hover:bg-[#1f1b31]/30 transition-colors items-center">
        {/* Project Column - Name Only */}
        <div className="col-span-1 min-w-0">
          <span className="text-sm font-medium text-gray-900 dark:text-purple-100 truncate block">
            {invite.projectId?.title || 'Unknown Project'}
          </span>
        </div>
        
        {/* Sender Column with Avatar */}
        <div className="col-span-1 flex items-center gap-2 min-w-0">
          <div className="flex-shrink-0">
            <UserAvatar
              user={invite.senderId}
              size="sm"
            />
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {invite.senderId?.username || 'Unknown User'}
          </span>
        </div>
        
        <div className="col-span-1">
          {getStatusBadge(invite.status)}
        </div>
        <div className="col-span-1 text-sm text-gray-600 dark:text-gray-400">
          {formatDate(invite.createdAt)}
        </div>
        <div className="col-span-2 flex justify-end gap-2">
          {invite.status === 'pending' && (
            <>
              <button
                onClick={() => onAccept(invite)}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {loading ? (
                  <Loader className="w-4 h-4" />
                ) : (
                  <FiCheck className="w-4 h-4" />
                )}
                Accept
              </button>
              <button
                onClick={() => onReject(invite)}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {loading ? (
                  <Loader className="w-4 h-4" />
                ) : (
                  <FiX className="w-4 h-4" />
                )}
                Reject
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Layout - Card Style */}
      <div className="sm:hidden p-4 space-y-3">
        {/* Header with Project and Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-purple-100 truncate">
              {invite.projectId?.title || 'Unknown Project'}
            </h3>
            {invite.projectId?.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                {invite.projectId.description}
              </p>
            )}
          </div>
          {getStatusBadge(invite.status)}
        </div>
        
        {/* Sender Info with Avatar */}
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            <UserAvatar
              user={invite.senderId}
              size="xs"
            />
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Invited by <span className="font-medium text-gray-900 dark:text-purple-100">{invite.senderId?.username || 'Unknown User'}</span>
          </span>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(invite.createdAt)}
        </div>

        {invite.status === 'pending' && (
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => onAccept(invite)}
              disabled={loading}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-sm"
            >
              {loading ? (
                <Loader className="w-4 h-4" />
              ) : (
                <FiCheck className="w-4 h-4" />
              )}
              Accept
            </button>
            <button
              onClick={() => onReject(invite)}
              disabled={loading}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-sm"
            >
              {loading ? (
                <Loader className="w-4 h-4" />
              ) : (
                <FiX className="w-4 h-4" />
              )}
              Reject
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
});

export default InviteRow;
     