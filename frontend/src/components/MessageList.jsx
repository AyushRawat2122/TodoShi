import React, { useRef, useEffect, useState } from 'react';
import Message from './Message';

const MessageList = ({ messages, currentUserId, onDeleteMessage, loadMoreMessages, hasMore, isLoading }) => {
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const prevScrollHeight = useRef(0);
  
  // Auto-scroll to bottom only for new messages (not when loading older ones)
  useEffect(() => {
    if (scrollRef.current && isAtBottom && !isLoading) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAtBottom, isLoading]);
  
  // Restore scroll position after loading older messages
  useEffect(() => {
    if (containerRef.current && prevScrollHeight.current > 0 && isLoading === false) {
      const newScrollHeight = containerRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeight.current;
      containerRef.current.scrollTop = scrollDiff;
      prevScrollHeight.current = 0;
    }
  }, [isLoading]);
  
  // Handle scroll to implement reverse scroll pagination
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    
    // Check if user is at bottom
    const atBottom = scrollHeight - scrollTop - clientHeight < 50;
    setIsAtBottom(atBottom);
    
    // If scrolled near top, load more messages
    if (scrollTop < 100 && hasMore && !isLoading && loadMoreMessages) {
      prevScrollHeight.current = scrollHeight;
      loadMoreMessages();
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto py-4 px-2 space-y-4"
      onScroll={handleScroll}
    >
      {/* Load more indicator */}
      {hasMore && !isLoading && messages.length > 0 && (
        <div className="text-center py-2 text-xs text-gray-400 dark:text-gray-500">
          Scroll up to load older messages
        </div>
      )}
      
      {!hasMore && messages.length > 0 && (
        <div className="text-center py-2 text-xs text-gray-400 dark:text-gray-500">
          No more messages
        </div>
      )}
      
      {messages.length === 0 && !isLoading && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No messages yet. Start the conversation!
        </div>
      )}
      
      {messages.map((message, index) => (
        <Message
          key={message._id || index}
          message={message}
          isOwnMessage={message.sender?._id === currentUserId}
          currentUserId={currentUserId}
          onDelete={onDeleteMessage}
        />
      ))}
      
      {/* Auto-scroll anchor */}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageList;
