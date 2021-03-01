import React, { useState } from "react";
import classnames from "classnames";
import SVG from "react-inlinesvg";

// Icons
import LogoIcon from "resources/logo_white.svg";
import DollarIcon from "resources/icons/dollar.svg";

// Components
import Glass from "components/Glass";

export default function Restaurant({ data }) {
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

    // Expensive icons
    var expansive = [];
    for (let i = 0; i < 5; i++) expansive.push(<SVG key={i} className={classnames("dollar", { active: i <= price })} src={DollarIcon} />);

    return (
        <div className="restaurant">
            <Glass>
                <div className="imageContainer">
                    {pictures}
                    <div className="leftHalf" onClick={onPrevPhoto}></div>
                    <div className="rightHalf" onClick={onNextPhoto}></div>
                </div>

                <p className="name">{name}</p>
                <p className="adress">{adress}</p>

                <div className="ratingContainer">
                    <p className="rating">{rating} / 5</p>
                    <SVG className="heart" src={LogoIcon} />
                </div>

                <div className="priceContainer">{expansive}</div>

                <p className="distance">300m away from {bossName}.</p>
            </Glass>
        </div>
    );
}
