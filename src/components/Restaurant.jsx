import React, { useState } from "react";
import classnames from "classnames";
import SVG from "react-inlinesvg";

// Icons
import LogoIcon from "resources/logo_white.svg";
import DollarIcon from "resources/icons/dollar.svg";

// Components
import Glass from "components/Glass";

export default function Restaurant({ data, verticalGestureBind, horizontalGestureBind }) {
    // Deconstruct data
    const { adress, /*lat, latBoss, lon, lonBoss,*/ bossName, name, photos, price, rating } = data;

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

    // On go to prev photo clicked
    const onPrevPhoto = () => {
        setCurrPhoto((prevState) => {
            var newIndex = --prevState;
            if (newIndex < 0) newIndex = photos.length - 1;
            return newIndex;
        });
    };

    // #################################################
    //   RENDER
    // #################################################

    // Return if it is no restaurant
    if (!name) return null;

    // Photos
    var pictures = photos.map((url, i) => <img key={i} src={url} alt="" className="picture" style={{ opacity: i === currPhoto ? 1 : 0 }} />);

    // Heart icons
    var hearts = [];
    for (let i = 0; i < 5; i++) hearts.push(<SVG key={i} className="heart" src={LogoIcon} />);

    // Expensive icons
    var expansive = [];
    for (let i = 0; i < 5; i++) expansive.push(<SVG key={i} className={classnames("dollar", { active: i <= price })} src={DollarIcon} />);

    return (
        <div className="restaurant" {...horizontalGestureBind}>
            <div className="gestureDiv" {...verticalGestureBind}>
                <div className="imageContainer">
                    {pictures}
                    <div className="leftHalf" onClick={onPrevPhoto}></div>
                    <div className="rightHalf" onClick={onNextPhoto}></div>
                </div>
                <Glass style={{ marginTop: "-45vw", paddingTop: "45vw" }}>
                    <p className="name">{name}</p>
                    <p className="adress">{adress}</p>

                    <div className="ratingContainer">
                        <div className="filled" style={{ clipPath: `inset(0 ${100 - (rating / 5) * 100}% 0 0)` }}>
                            {hearts}
                        </div>

                        <div className="empty" style={{ clipPath: `inset(0 0 0 ${(rating / 5) * 100}%)` }}>
                            {hearts}
                        </div>
                    </div>

                    <div className="priceContainer">{expansive}</div>
                </Glass>

                <p className="distance">300m away from {bossName}</p>
            </div>
        </div>
    );
}
