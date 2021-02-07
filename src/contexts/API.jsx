import React, { createContext, useContext } from "react";

// Contexts
import { Utils } from "contexts/Utils";
import { Data } from "contexts/Data";

// API Context
export const API = createContext();

const APIProvider = (props) => {
    // Contexts
    const { setCookie, getCookie, clearCookies } = useContext(Utils);
    const { token, username, userID } = useContext(Data);

    const apiURL = "https://matcheat.herokuapp.com/"; //"http://localhost:3100/";

    // Create a new user
    const register = async (name, email, password) => {
        // Post data
        var postData = {
            name,
            email,
            password,
        };

        try {
            // Fetch
            await fetch(apiURL + "api_v1/user/register", {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            return {};
        } catch (e) {
            return e;
        }
    };

    // Authenticate an existing user
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
            if ("id" in response) userID.current = response.id;

            // Set token cookie
            setCookie("matchEat_token", response.token, 365);
            setCookie("matchEat_name", response.name, 365);
            setCookie("matchEat_id", response.id, 365);

            // Return response
            return response;
        } catch (e) {
            return e;
        }
    };

    // Log out the current user
    const logout = () => {
        token.current = null;
        username.current = null;
        userID.current = null;

        clearCookies();
    };

    // Check if there is a user logged in
    const isLoggedIn = () => {
        const tokenInCookie = getCookie("matchEat_token");
        const nameInCookie = getCookie("matchEat_name");
        const idInCookie = getCookie("matchEat_id");

        // If they exist, save in data and return true
        if (tokenInCookie && nameInCookie && idInCookie) {
            token.current = tokenInCookie;
            username.current = nameInCookie;
            userID.current = idInCookie;

            // Renew expiration
            setCookie("matchEat_token", tokenInCookie, 365);
            setCookie("matchEat_name", nameInCookie, 365);
            setCookie("matchEat_id", idInCookie, 365);

            return true;
        }
        return false;
    };

    // Return the context
    return (
        <API.Provider
            value={{
                register,
                login,
                logout,
                isLoggedIn,
            }}
        >
            {props.children}
        </API.Provider>
    );
};

export default APIProvider;
