import React, { createContext, useRef, useContext, useState } from "react";
import { useSpring } from "react-spring";

// Contexts
import { Utils } from "contexts/Utils";

// Data Context
export const Data = createContext();

const DataProvider = (props) => {
    // Contexts
    const { getCookie } = useContext(Utils);

    // LANDING CHECK
    const landingDone = useRef(false);

    // USER
    const token = useRef(null);
    const username = useRef(null);
    const userID = useRef(null);
    const image = useRef(null);

    // ROOM
    const [roomID, setRoomID] = useState(null);
    const [roomUsers, setRoomUsers] = useState([]);
    const socketError = useRef(null);
    const isBoss = useRef(false);

    // RESTAURANTS ROJAS remove RESTAURANTDELETE
    const restaurants = useRef([
        {
            photos: [
                "https://lh3.googleusercontent.com/p/AF1QipMkvAqFhxK5C4_VCmjAt7DUjK_k4YliFoNOxwfw=s1600-h500",
                "https://lh3.googleusercontent.com/p/AF1QipNHGTKO9COhx4pjPF-rg0lXdfxQntFIL6Ycq3Cy=s1600-h500",
                "https://lh3.googleusercontent.com/p/AF1QipOtfYd8kiY1hNV5M4DCdh1z-YJ41kSnaOoGC10R=s1600-h500",
            ],
            _id: "603d3c648a903105bb0a755e",
            name: "TGB The good burger",
            lat: 41.3905744,
            lon: 2.1625085,
            latBoss: 41.390564,
            lonBoss: 2.162579,
            bossName: "Carles",
            restaurantID: "ChIJ02w-UryjpBIR-YzEw_pfAtQ",
            rating: 3.8,
            adress: "C/ d'Aragó, 237, 08007 Barcelona, Spain",
            price: 1,
            roomID: "SKP91j",
            score: 0,
        },
        {
            photos: [
                "https://lh3.googleusercontent.com/p/AF1QipPVgGe2ORGmxgMb7r5jOZQM3A-DAIlPM93y25l7=s1600-w500",
                "https://lh3.googleusercontent.com/p/AF1QipNwV2LhWPn0EVZJX9KKMxz59y7c4K5ilG7sLpcW=s1600-h500",
                "https://lh3.googleusercontent.com/p/AF1QipNV7TqzYZVIfzKfLCmJFge-9_jIHFowbVLP675h=s1600-h500",
            ],
            _id: "603d3c648a903105bb0a755f",
            name: "RESTAURANT GAUDIM",
            lat: 41.3902723,
            lon: 2.1621207,
            latBoss: 41.390564,
            lonBoss: 2.162579,
            bossName: "Carles",
            restaurantID: "ChIJv8oinY2ipBIRm_iLk3p0MpQ",
            rating: 4.4,
            adress: "C/ d'Aragó, 231, 08007 Barcelona, Spain",
            price: 3,
            roomID: "SKP91j",
            score: 0,
        },
        {
            photos: [
                "https://lh3.googleusercontent.com/p/AF1QipOnUr0ABrhmAyN-EjQ1W6AfCj_NHVnU8NYc2pxR=s1600-h500",
                "https://lh3.googleusercontent.com/p/AF1QipO1yL__SvSFbq0_jJ2Q1Ri3DxFwCPCTfEx2AXWf=s1600-w500",
                "https://lh3.googleusercontent.com/p/AF1QipOJIs9z0zpMoY5sf_AJcFIjSQ2oZEge2Z5S01CN=s1600-h500",
            ],
            _id: "603d3c658a903105bb0a7560",
            name: "Odacova",
            lat: 41.39003040000001,
            lon: 2.1622971,
            latBoss: 41.390564,
            lonBoss: 2.162579,
            bossName: "Carles",
            restaurantID: "ChIJq5V378mjpBIRzFQMJVP3B2M",
            rating: 4.4,
            adress: "C/ d'Aragó, 238, 08007 Barcelona, Spain",
            price: 2,
            roomID: "SKP91j",
            score: 0,
        },
        {
            photos: [
                "https://lh3.googleusercontent.com/p/AF1QipM4FqkOo54fYcpgfqSRFr40Sb_xbOL95ueQ6ew_=s1600-w500",
                "https://lh3.googleusercontent.com/p/AF1QipP6nx93Kj5wRI9Doh5h9o5y0NlAxZAKF7NA3oOp=s1600-h500",
                "https://lh3.googleusercontent.com/p/AF1QipMIq4Ftrlhj1Iso-YfLwTlmozaN9uWCg2vtSQsb=s1600-h500",
            ],
            _id: "603d3c668a903105bb0a7561",
            name: "Foster's Hollywood",
            lat: 41.39055390000001,
            lon: 2.1614098,
            latBoss: 41.390564,
            lonBoss: 2.162579,
            bossName: "Carles",
            restaurantID: "ChIJOfXakY2ipBIRjXgtCVc1Rn8",
            rating: 3.9,
            adress: "Carrer de Balmes, 76, 08008 Barcelona, Spain",
            price: 2,
            roomID: "SKP91j",
            score: 0,
        },
        {
            photos: [
                "https://lh3.googleusercontent.com/p/AF1QipMjCoivhWqMgSRuZix1l1pPLsrF7BL5jhDjnmGy=s1600-h500",
                "https://lh3.googleusercontent.com/p/AF1QipM6T0EIAPUOgZ8GAUm4_K48rVtREAaqVg1XVAx6=s1600-h500",
                "https://lh3.googleusercontent.com/p/AF1QipNT29W5A9kGvXGYGO2CNhapKbxnuBqoOMx9Ulw=s1600-h500",
            ],
            _id: "603d3c668a903105bb0a7562",
            name: "Takumi Ramen Barcelona",
            lat: 41.3896306,
            lon: 2.1619371,
            latBoss: 41.390564,
            lonBoss: 2.162579,
            bossName: "Carles",
            restaurantID: "ChIJCci2oY2ipBIR8odvxCKv1ec",
            rating: 4.5,
            adress: "Carrer de Balmes, 59, 08007 Barcelona, Spain",
            price: 2,
            roomID: "SKP91j",
            score: 0,
        },
    ]);

    // BACKGROUND POSITION
    const positionRef = useRef({ x: 0, y: 0 });
    const speedRef = useRef({ x: 0, y: 0 });
    const motion = useRef({ alpha: 0, beta: 0 });
    const prevMotion = useRef({ alpha: 0, beta: 0 });

    // BACKGROUND GRADIENT
    const gradients = {
        red: ["#ff8a5f", "#be4242"],
        pink: ["#ff74d4", "#ff8a5f"],
        purple: ["#8374ff", "#ff74d4"],
        blue: ["#232b62", "#69acff"],
        green: ["#2d903a", "#69acff"],
        blaugrana: ["#ff5f7d", "#5542be"],
        grey: ["#5b5b5b", "#2e2e2e"],
    };
    const currGradient = useRef(getCookie("matchEat_token") ? "blaugrana" : "pink");
    const [{ gradient }, setGradient] = useSpring(() => ({
        gradient: `linear-gradient(60deg, ${gradients[currGradient.current][0]} 0%, ${gradients[currGradient.current][1]} 100%)`,
        config: { friction: 30 },
    }));
    const setBackgroundGradient = (gradientName) => {
        if (!(gradientName in gradients)) return;

        // Set the background gradient
        setGradient({ gradient: `linear-gradient(60deg, ${gradients[gradientName][0]} 0%, ${gradients[gradientName][1]} 100%)` });
        currGradient.current = gradientName;
    };

    return (
        <Data.Provider
            value={{
                // LANDING CHECK
                landingDone,

                // USER
                token,
                username,
                userID,
                image,

                // ROOM
                roomID,
                setRoomID,
                roomUsers,
                setRoomUsers,
                socketError,
                isBoss,

                // RESTAURANTS
                restaurants,

                // BACKGROUND POSITION
                positionRef,
                speedRef,
                motion,
                prevMotion,

                //BACKGROUND GRADIENT
                gradient,
                setBackgroundGradient,
            }}
        >
            {props.children}
        </Data.Provider>
    );
};

export default DataProvider;
