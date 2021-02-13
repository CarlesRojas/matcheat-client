import React, { createContext, useContext, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";

// Contexts
import { API } from "contexts/API";

// API Context
export const Socket = createContext();

const SocketProvider = (props) => {
    // Contexts
    const { apiURL } = useContext(API);

    // Socket
    const socket = useRef(null);

    // #################################################
    //   CONNECTION
    // #################################################

    // Connect to socket
    const connect = (errorCallback) => {
        if (socket.current) return;

        socket.current = socketIOClient(apiURL);

        // Recieve error messages
        socket.current.on("error", ({ error, errorCode }) => {
            // Inform about the error
            window.PubSub.emit("onSocketError", { error, errorCode });
        });

        socket.current.on("disconnect", () => {
            // Inform about the disconnection
            window.PubSub.emit("onSocketDisconnected");
        });
    };

    // Disconnect from socket
    const disconnect = () => {
        if (socket.current) socket.current.disconnect();
    };

    // #################################################
    //   SUBSCRIBE TO EVENTS
    // #################################################

    // Subscribe to an event
    const sub = (eventName, callback) => {
        if (!socket.current) return;

        // Subscribe to event
        socket.current.on(eventName, callback);
    };

    // Unsubscribe to an event
    const unsub = (eventName, callback) => {
        if (!socket.current) return;

        // Subscribe to event
        socket.current.off(eventName, callback);
    };

    // #################################################
    //   EMIT EVENTS
    // #################################################

    // Emit an event
    const emit = (eventName, payload) => {
        if (!socket.current) return;

        // Subscribe to event
        socket.current.emit(eventName, payload);
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        // Discontect on unmount
        return () => {
            if (socket.current) socket.current.disconnect();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Return the context
    return (
        <Socket.Provider
            value={{
                // CONNECTION
                connect,
                disconnect,

                // SUBSCRIBE TO EVENTS
                sub,
                unsub,

                // EMIT EVENTS
                emit,
            }}
        >
            {props.children}
        </Socket.Provider>
    );
};

export default SocketProvider;
