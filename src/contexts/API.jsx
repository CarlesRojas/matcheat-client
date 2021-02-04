import React, { createContext, useContext } from "react";

// Contexts
import { Utils } from "contexts/Utils";
import { Data } from "contexts/Data";

// API Context
export const API = createContext();

const APIProvider = (props) => {
    // Contexts
    const { setCookie } = useContext(Utils);
    const { token, username, userID } = useContext(Data);

    const apiURL = "https://matcheat.herokuapp.com/"; //"http://localhost:3100/";

    const register = async (name, email, password) => {
        // Post data
        var postData = {
            name,
            email,
            password,
        };

        try {
            // Fetch
            var rawResponse = await fetch(apiURL + "api_v1/user/register", {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            // Get data from response
            const response = await rawResponse.json();
            if ("id" in response) userID.current = response.id;

            // Return response
            return response;
        } catch (e) {
            return e;
        }
    };

    const login = async (email, password) => {
        // Post data
        var postData = {
            email,
            password,
        };

        try {
            // Fetch
            var rawResponse = await fetch(apiURL + "api_v1/user/login", {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            // Get data from response
            const response = await rawResponse.json();
            if ("token" in response) token.current = response.token;
            if ("name" in response) username.current = response.name;

            // Set token cookie
            setCookie("matchEat_token", response.token, 365);

            // Return response
            return response;
        } catch (e) {
            return e;
        }
    };

    // Return the context
    return (
        <API.Provider
            value={{
                register,
                login,
            }}
        >
            {props.children}
        </API.Provider>
    );
};

export default APIProvider;
