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
    const connect = () => {
        if (socket.current) return;

        socket.current = socketIOClient(apiURL);

        // Recieve error messages
        socket.current.on("error", ({ error, errorCode }) => {
            console.log(error);
            // Inform about the error
            window.PubSub.emit("onSocketError", { error, errorCode });
        });

        socket.current.on("disconnect", () => {
            console.log("Disconnected from server");
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

    // Subscribe to an event only once
    const subOnce = (eventName, callback) => {
        if (!socket.current) return;

        // Subscribe to event
        socket.current.once(eventName, callback);
    };

    // Unsubscribe to an event
    const unsub = (eventName) => {
        if (!socket.current) return;

        // Subscribe to event
        console.log(`Unsub from ${eventName}`);
        socket.current.removeAllListeners(eventName);
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
                subOnce,
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
