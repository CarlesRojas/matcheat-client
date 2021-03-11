import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import EventsPubSub from "./EventsPubSub";
import * as serviceWorker from "./serviceWorker";

// Contexts
import UtilsProvider from "contexts/Utils";
import DataProvider from "contexts/Data";
import APIProvider from "contexts/API";
import SocketProvider from "contexts/Socket";

import "./index.scss";

// Register the PubSub
window.PubSub = new EventsPubSub();

// Render React App
ReactDOM.render(
    <UtilsProvider>
        <DataProvider>
            <APIProvider>
                <SocketProvider>
                    <App />
                </SocketProvider>
            </APIProvider>
        </DataProvider>
    </UtilsProvider>,

    document.getElementById("root")
);

// Register service worker
serviceWorker.register();
