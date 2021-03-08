import React, { useRef, useState } from "react";
import { getDistance } from "geolib";

// Components
import Glass from "components/Glass";

export default function Loser({ data, position }) {
    // Deconstruct data
    const { adress, lat, latBoss, lon, lonBoss, bossName, name, photos, loves, likes, restaurantID } = data;

    // #################################################
    //   DISTANCE
    // #################################################

    // Distance
    const distanceToBoss = useRef(Math.round(getDistance({ latitude: lat, longitude: lon }, { latitude: latBoss, longitude: lonBoss })));

    // #################################################
    //   PICTURES CARROUSEL
    // #################################################

    // Current showing photo
    const [currPhoto, setCurrPhoto] = useState(0);

    // On go to next photo clicked
    const onNextPhoto = () => {
        setCurrPhoto((prevState) => {
            var newIndex = ++prevState;
            if (newIndex >= photos.length) newIndex = 0;
            return newIndex;
        });
    };

    // #################################################
    //   RENDER
    // #################################################

    // Return if it is no restaurant
    if (!name) return null;

    // Photos
    const pictures = photos.map((url, i) => <img key={i} src={url} alt="" className="picture" style={{ opacity: i === currPhoto ? 1 : 0 }} onClick={onNextPhoto} />);

    // Likes and loves
    var users = [];
    loves.forEach(({ image }, i) => {
        users.push(<img src={image} alt="" key={`love${i}`} className="loveUser" />);
    });
    likes.forEach(({ image }, i) => {
        users.push(<img src={image} alt="" key={`like${i}`} className="likeUser" />);
    });

    // Users module
    const usersModule = users.length ? (
        <div className="loserContainer">
            <div className="loserOverflowContainer">
                <div className="usersContainer">{users}</div>
            </div>
        </div>
    ) : (
        <div className="padding"></div>
    );

    return (
        <div className="loser">
            <Glass>
                <div className="loserProfile">
                    <div className="imageContainer">{pictures}</div>

                    <div className="info">
                        <p className="name">{name}</p>

                        <p className="adress">{adress}</p>

                        <a
                            className="googleMapsLink"
                            href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&destination_place_id=${restaurantID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Get Directions
                        </a>
                    </div>
                </div>

                {usersModule}
            </Glass>

            <div className="number">{position + 1}</div>

            <p className="distance">
                {distanceToBoss.current}m away from {bossName}
            </p>
        </div>
    );
}
