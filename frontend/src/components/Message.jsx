import React, { useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import { FaTrash } from 'react-icons/fa';
import { useProject } from '../store/project';
import { analyzeEmojiContent } from '../utils/emojiUtils';
import UserAvatar from './UserAvatar';

const Message = ({ message, isOwnMessage, currentUserId, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const { openImageViewer } = useProject();
  const formattedTime = message.createdAt ? format(new Date(message.createdAt), 'hh:mm a') : '';
  const emojiAnalysis = analyzeEmojiContent(message.content);
  
  // Check if message can be deleted (own message less than 1 day old)
  const isDeleteAllowed = React.useMemo(() => {
    if (!message.createdAt || message.sender?._id !== currentUserId) return false;
    const messageDate = new Date(message.createdAt);
    return differenceInDays(new Date(), messageDate) <= 1;
  }, [message.createdAt, message.sender?._id, currentUserId]);
  
  // Check if URL is an image
  const isImageUrl = (url) => url?.match(/\.(jpeg|jpg|gif|png|webp)$/i);

  // Handle delete with loading state
  const handleDelete = async () => {
    if (deleting) return;
    
    try {
      setDeleting(true);
      await onDelete(message._id);
    } catch (error) {
      console.error('Error deleting message:', error);
      setDeleting(false); // Reset state if error occurs
    }
    // Note: We don't set deleting to false on success because the component will unmount
  };

  return (
    <div className={`flex items-start gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* User Avatar */}
      <div className="flex-shrink-0">
        <UserAvatar 
          user={message.sender} 
          className="w-7 h-7" 
        />
      </div>
      
      {/* Message Content */}
      <div className={`relative group ${
        isOwnMessage 
          ? "bg-blue-50 dark:bg-[#4c1f8e]/30 border border-blue-200 dark:border-[#c2a7fb]/20" 
          : "bg-white dark:bg-[#13111d] border border-gray-200 dark:border-[#2a283a]"
        } p-3 rounded-lg min-w-[120px] max-w-xs shadow-sm ${emojiAnalysis.isEmojiOnly ? 'max-w-fit min-w-0' : ''}`}
      >
        {/* Deleting overlay */}
        {deleting && (
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40 rounded-lg flex items-center justify-center z-10">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <p className="text-sm font-semibold text-gray-800 dark:text-purple-200">
          {isOwnMessage ? 'You' : message.sender?.username || 'Unknown User'}
        </p>
        
        <div className={`${
          emojiAnalysis.isEmojiOnly 
            ? `message-content-emoji-only ${isOwnMessage ? 'own-message' : ''}` 
            : 'text-gray-700 dark:text-purple-200/80 break-words'
        }`}>
          {emojiAnalysis.isEmojiOnly ? (
            <span className={emojiAnalysis.sizeClass}>{message.content}</span>
          ) : (
            <span>{message.content}</span>
          )}
        </div>
        
        {message.attachment && (
          <div className="mt-2">
            <div className="relative">
              {isImageUrl(message.attachment.url) ? (
                <div 
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => openImageViewer(message.attachment.url)}
                >
                  <img 
                    src={message.attachment.url} 
                    alt="Attachment"
                    className="max-h-40 w-auto rounded border border-gray-200 dark:border-[#2a283a]"
                  />
                  <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                    Click to view
                  </div>
                </div>
              ) : (
                <a 
                  href={message.attachment.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-2 bg-gray-50 dark:bg-[#13111d]/50 rounded border border-gray-200 dark:border-[#2a283a] hover:bg-gray-100 dark:hover:bg-[#13111d] transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center mr-2">
                    <span className="text-blue-600 dark:text-blue-300 text-xs font-bold">DOC</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 text-sm">Attachment</span>
                </a>
              )}
            </div>
          </div>
        )}
        
        <span className="text-xs text-gray-500 dark:text-purple-200/50">{formattedTime}</span>
        
        {isDeleteAllowed && !deleting && (
          <button 
            onClick={handleDelete}
            disabled={deleting}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
            title="Delete message"
          >
            <FaTrash className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;
