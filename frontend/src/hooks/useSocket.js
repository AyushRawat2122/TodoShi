import { useEffect, useCallback } from "react";
import { getSocket } from "../utils/socket";

/**
 * useSocketOn Hook
 *
 * A custom React hook that subscribes to a socket.io event and cleans up when the component unmounts.
 *
 * @param {string} event - The socket event name to listen for
 * @param {function} callback - The function to execute when the event is received
 *
 * Example usage:
 * useSocketOn('chat-message', (message) => {
 *   console.log('New message:', message);
 * });
 */
export const useSocketOn = (event, callback) => {
  useEffect(() => {
    // Get the socket instance from the utility
    const socket = getSocket();
    if (!socket) return; // Exit if no socket connection exists

    // Register the event listener
    socket.on(event, callback);

    // Cleanup function to remove the event listener when component unmounts
    // or when event/callback dependencies change
    return () => {
      socket.off(event, callback);
    };
  }, [event, callback]);
};

/**
 * useSocketEmit Hook
 *
 * A custom React hook that emits a socket.io event whenever specified dependencies change.
 *
 * @param {string} event - The socket event name to emit
 * @param {any} data - The data to send with the event
 *
 * Example usage:
 * useSocketEmit('join-room', { roomId: '123', username: 'John' });
 */

export const useSocketEmit = () => {
  const emit = useCallback((event, data) => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit(event, data);
  }, []);

  return emit;
};
