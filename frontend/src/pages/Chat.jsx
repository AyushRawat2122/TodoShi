import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FaBars, FaTimes, FaPaperPlane, FaImage, FaSmile } from 'react-icons/fa';
import { useProject } from '../store/project';
import MessageList from '../components/MessageList';
import useIsLargeScreen from '../hooks/useIsLargeScreen';
import useUser from '../hooks/useUser';
import useTheme from '../hooks/useTheme';
import EmojiPicker from 'emoji-picker-react';
import { useForm } from 'react-hook-form';
import serverRequest from '../utils/axios';
import UserAvatar from '../components/UserAvatar';

export default function Chat() {
  const { projectId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLarge = useIsLargeScreen();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [sending, setSending] = useState(false);
  const { isDark } = useTheme();
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: { content: '', image: null }
  });

  const messageContent = watch('content');

  // Get user and project data
  const { user } = useUser();
  const currentUserId = user?.data?._id || null;
  const currentUsername = user?.data?.username || 'You';

  const {
    roomID,
    chats,
    onlineUsers,
    oldestMessageId,
    prependChats
  } = useProject();

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load more messages (for reverse scroll)
  const loadMoreMessages = async () => {
    if (!hasMoreMessages || isLoadingMessages || !oldestMessageId) return;

    try {
      setIsLoadingMessages(true);
      const { data } = await serverRequest.get(
        `/chats/getPreviousMessages/${projectId}?lastMessageId=${oldestMessageId}`
      );

      const olderMessages = data?.data || [];
      if (olderMessages.length > 0) {
        prependChats(olderMessages);
        setHasMoreMessages(olderMessages.length === 50);
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Handle message sending
  const handleSendMessage = async (data) => {
    if (!data.content.trim() && !selectedImage || sending) return;

    try {
      setSending(true);
      const formData = new FormData();
      formData.append('content', data.content.trim() || '📷');
      formData.append('projectId', projectId);
      formData.append('senderId', currentUserId);

      if (selectedImage) {
        formData.append('attachments', selectedImage);
      }

      await serverRequest.post(
        `/chats/sendMessage/${roomID}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      reset();
      removeImage();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  // Handle message deletion
  const handleDeleteMessage = async (messageId) => {
    try {
      // Return the promise so the Message component can handle loading state
      return await serverRequest.delete(`/chats/deleteMessage/${roomID}`, {
        data: { messageId, userId: currentUserId }
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error; // Re-throw so the Message component can handle error state
    }
  };

  // Handle emoji selection
  const onEmojiClick = (emojiData) => {
    setValue('content', (messageContent || '') + emojiData.emoji);
  };

  // Validate and handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type and size
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 1048576; // 1MB

    if (!validTypes.includes(file.type)) {
      setUploadError('Only JPG and PNG images are allowed');
      resetFileInput();
      return;
    }

    if (file.size > maxSize) {
      setUploadError('Image size must be less than 1MB');
      resetFileInput();
      return;
    }

    setUploadError('');
    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Reset file input
  const resetFileInput = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Remove selected image
  const removeImage = () => {
    resetFileInput();
    setUploadError('');
  };

  return (
    <div className="flex relative h-[90%] bg-gray-50 dark:bg-[#0c0a1a] overflow-hidden">
      {/* Main Chat Area */}
      <div className={`flex-grow flex flex-col h-full transition-all duration-300 ${isLarge ? 'mr-80' : 'mr-0'}`}>
        {isLoadingMessages && (
          <div className="text-center py-2 text-sm text-gray-500 dark:text-gray-400">
            Loading messages...
          </div>
        )}

        <MessageList
          messages={chats || []}
          currentUserId={currentUserId}
          onDeleteMessage={handleDeleteMessage}
          loadMoreMessages={loadMoreMessages}
          hasMore={hasMoreMessages}
          isLoading={isLoadingMessages}
        />

        <div className="border-t border-gray-200 dark:border-[#2a283a] p-4 bg-gray-50 dark:bg-[#0c0a1a]">
          {imagePreview && (
            <div className="mb-2 relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-20 w-20 object-cover rounded-lg border border-gray-300 dark:border-[#2a283a]"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            </div>
          )}

          {uploadError && (
            <div className="mb-2 text-red-500 dark:text-red-400 text-sm">
              {uploadError}
            </div>
          )}

          <form onSubmit={handleSubmit(handleSendMessage)} className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageSelect}
              className="hidden"
            />

            <div className="flex-grow flex items-center bg-white dark:bg-[#13111d] border border-gray-200 dark:border-[#2a283a] rounded-3xl px-2 py-1 focus-within:ring-2 focus-within:ring-[#6229b3] dark:focus-within:ring-[#c2a7fb] transition-all">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-600 dark:text-purple-200 hover:bg-gray-100 dark:hover:bg-[#13111d]/80 rounded-full transition-colors"
                title="Upload image (max 1MB, JPG/PNG)"
              >
                <FaImage className="w-5 h-5" />
              </button>

              <div className="relative" ref={emojiPickerRef}>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-600 dark:text-purple-200 hover:bg-gray-100 dark:hover:bg-[#13111d]/80 rounded-full transition-colors"
                  title="Add emoji"
                >
                  <FaSmile className="w-5 h-5" />
                </button>

                {showEmojiPicker && (
                  <div className="absolute bottom-full left-0 mb-2 z-50">
                    <div className={`${isDark ? 'emoji-picker-dark' : 'emoji-picker-light'}`}>
                      <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        theme={isDark ? 'dark' : 'light'}
                        height={400}
                        emojiStyle="google"
                        width={320}
                        searchDisabled={false}
                        skinTonesDisabled={false}
                        previewConfig={{ showPreview: false }}
                        style={{
                          '--epr-bg-color': isDark ? '#13111d' : '#ffffff',
                          '--epr-category-label-bg-color': isDark ? '#13111d' : '#f9fafb',
                          '--epr-search-input-bg-color': isDark ? '#0c0a1a' : '#f3f4f6',
                          '--epr-text-color': isDark ? '#e9d5ff' : '#1f2937',
                          '--epr-emoji-hover-color': isDark ? '#c2a7fb1a' : '#e5e7eb',
                          '--epr-highlight-color': isDark ? '#6229b3' : '#6229b3',
                          '--epr-hover-bg-color': isDark ? '#c2a7fb1a' : '#f3f4f6',
                          '--epr-focus-bg-color': isDark ? '#c2a7fb33' : '#e5e7eb',
                          '--epr-search-border-color': isDark ? '#2a283a' : '#d1d5db',
                          '--epr-category-icon-active-color': isDark ? '#c2a7fb' : '#6229b3',
                          '--epr-skin-tone-picker-menu-color': isDark ? '#13111d' : '#ffffff',
                          '--epr-header-overlay-color': isDark ? 'transparent' : 'transparent',
                          '--epr-category-navigation-button-size': '30px',
                          borderRadius: '12px',
                          border: isDark ? '1px solid #2a283a' : '1px solid #e5e7eb',
                          boxShadow: isDark
                            ? '0 10px 15px -3px rgba(98, 41, 179, 0.1), 0 4px 6px -2px rgba(98, 41, 179, 0.05)'
                            : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <input
                type="text"
                {...register('content')}
                placeholder="Write a message..."
                className="flex-grow px-3 py-2.5 bg-transparent focus:outline-none text-gray-900 dark:text-purple-100 placeholder-gray-400 dark:placeholder-purple-200/40"
              />
            </div>

            <button
              type="submit"
              disabled={(!messageContent?.trim() && !selectedImage) || sending}
              className="p-2.5 bg-[#6229b3] hover:bg-[#6229b3]/90 transition-all text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send message"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaPaperPlane className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      {!isLarge && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 right-4 z-30 bg-[#6229b3] hover:bg-[#6229b3]/90 text-white p-3 rounded-lg shadow-lg transition-all"
        >
          {sidebarOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
        </button>
      )}

      {/* Online Users Sidebar */}
      <div
        className={`w-80 absolute top-0 right-0 h-full transition-all duration-300 z-20
          bg-gray-50 dark:bg-transparent dark:bg-gradient-to-br dark:from-gray-900/80 dark:to-[#4c1f8e]/80
          shadow-md dark:backdrop-blur-md rounded-l-2xl
          ${!isLarge && !sidebarOpen ? 'translate-x-full' : 'translate-x-0'}`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-[#c2a7fb]/20">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white">Online Now</h3>
          <p className="text-sm text-gray-600 dark:text-gray-200">
            {onlineUsers.length} {onlineUsers.length === 1 ? 'person' : 'people'}
          </p>
        </div>

        <div className="overflow-y-auto" style={{ height: 'calc(100% - 70px)' }}>
          <div className="p-2 space-y-2">
            {onlineUsers.length > 0 ? (
              onlineUsers.map((user) => (
                <div key={user.userId} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-[#c2a7fb]/10 rounded-md transition-colors">
                  <div className="flex-shrink-0 mr-3">
                    <UserAvatar
                      user={{
                        _id: user.userId,
                        username: user.username,
                        avatar: user.avatar
                      }}
                      className="w-8 h-8"
                    />
                  </div>
                  <span className="text-gray-800 dark:text-gray-100">
                    {user.username}
                    {user.userId === currentUserId && ' (You)'}
                  </span>
                  <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No one is online right now
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile backdrop */}
      {!isLarge && sidebarOpen && isDark && (
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
