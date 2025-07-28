import { useEffect } from "react";
import { getSocket } from "../utils/socket";

export const useSocketOn = (event, callback) => {
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        socket.on(event, callback);

        return () => {
            socket.off(event, callback);
        };
    }, [event, callback]);
}

export const useSocketEmit = (event, data) => {
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        socket.emit(event, data);
    }, [event, data]);
}