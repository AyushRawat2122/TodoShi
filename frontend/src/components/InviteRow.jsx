import React, { memo } from 'react';
import { BiCheck, BiX } from 'react-icons/bi';
import Loader from './Loader';

/**
 * InviteRow component for displaying an invitation with accept/reject actions
 * 
 * @param {Object} invite - Invite object with email, role, status, invitedBy, sentAt
 * @param {Function} onAccept - Function to call when accepting invite
 * @param {Function} onReject - Function to call when rejecting invite
 * @param {boolean} loading - Whether action is in progress
 */
const InviteRow = memo(({ invite, onAccept, onReject, loading }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    
    return (
      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-6 gap-4 py-4 px-4 border-b border-gray-200 dark:border-[#2a283a] items-center">
      {/* Email */}
      <div className="col-span-1">
        <div className="text-sm font-medium text-gray-900 dark:text-purple-100">
          {invite.email}
        </div>
      </div>

      {/* Role */}
      <div className="col-span-1">
        <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
          {invite.role || 'Member'}
        </div>
      </div>

      {/* Status */}
      <div className="col-span-1">
        {getStatusBadge(invite.status)}
      </div>

      {/* Invited By */}
      <div className="col-span-1">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {invite.invitedBy || 'You'}
        </div>
      </div>

      {/* Sent Date */}
      <div className="col-span-1">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(invite.sentAt || invite.createdAt)}
        </div>
      </div>

      {/* Actions */}
      <div className="col-span-1 flex justify-end gap-2">
        {invite.status === 'pending' && (
          <>
            <button
              onClick={() => onAccept(invite)}
              disabled={loading}
              className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <Loader className="w-4 h-4" /> : 'Accept'}
            </button>
            <button
              onClick={() => onReject(invite)}
              disabled={loading}
              className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <Loader className="w-4 h-4" /> : 'Reject'}
            </button>
          </>
        )}
      </div>
    </div>
  );
});

export default InviteRow;
