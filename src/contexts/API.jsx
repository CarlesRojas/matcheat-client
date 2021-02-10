import React, { createContext, useContext } from "react";

// Contexts
import { Utils } from "contexts/Utils";
import { Data } from "contexts/Data";

// API Context
export const API = createContext();

const APIProvider = (props) => {
    // Contexts
    const { setCookie, getCookie, clearCookies, urltoFile } = useContext(Utils);
    const { token, username, userID, image } = useContext(Data);

    const apiURL = "https://matcheat.herokuapp.com/"; //"http://localhost:3100/"; //

    // Create a new user
    const register = async (name, email, password, image) => {
        // #################################################
        //   GET S3 URL WHERE WE CAN UPLOAD THE IMAGE
        // #################################################

        // Transform Base 64 to file
        const fileName = new Date().toISOString() + "_" + name + ".png";
        var imageFile = await urltoFile(image, fileName);

        // Post data
        var postData = {
            fileName: fileName,
            fileType: "image/png",
        };

        try {
            // Fetch S3 url configuration
            var rawResponse = await fetch(apiURL + "api_v1/aws/getS3URL", {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            // Get data from response
            var response = await rawResponse.json();
            var signedRequest = response.signedRequest;
            var url = response.url;
        } catch (error) {
            return error;
        }
        // #################################################
        //   UPLOAD THE IMAGE
        // #################################################

        try {
            // Fetch S3 url configuration
            await fetch(signedRequest, {
                method: "put",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "image/png",
                    "Access-Control-Allow-Origin": "*",
                },
                body: imageFile,
            });
        } catch (error) {
            return error;
        }

        // #################################################
        //   SIGN UP
        // #################################################

        // Post data
        postData = {
            name,
            email,
            password,
            image: url,
        };

        try {
            // Fetch
            rawResponse = await fetch(apiURL + "api_v1/user/register", {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            // Get data from response
            response = await rawResponse.json();

            // Return response
            return response;
        } catch (error) {
            return error;
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
            if ("image" in response) image.current = response.image;

            // Set token cookie
            setCookie("matchEat_token", response.token, 365);
            setCookie("matchEat_name", response.name, 365);
            setCookie("matchEat_id", response.id, 365);
            setCookie("matchEat_image", response.image, 365);

            // Return response
            return response;
        } catch (error) {
            return error;
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
        const imageInCookie = getCookie("matchEat_image");

        // If they exist, save in data and return true
        if (tokenInCookie && nameInCookie && idInCookie && imageInCookie) {
            token.current = tokenInCookie;
            username.current = nameInCookie;
            userID.current = idInCookie;
            image.current = imageInCookie;

            // Renew expiration
            setCookie("matchEat_token", tokenInCookie, 365);
            setCookie("matchEat_name", nameInCookie, 365);
            setCookie("matchEat_id", idInCookie, 365);
            setCookie("matchEat_image", imageInCookie, 365);

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
