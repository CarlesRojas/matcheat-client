import React, { useRef, useEffect, useState, useContext, memo } from "react";
import { isMobileOnly } from "react-device-detect";
import { useSpring } from "react-spring";
import SVG from "react-inlinesvg";

// Icons
import Icons from "resources/background.svg";

// Contexts
import { Data } from "contexts/Data";

// Constants
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const TILE_SIZE = SCREEN_WIDTH / 2;
const NUM_TILES = { x: Math.ceil(SCREEN_WIDTH / TILE_SIZE) + 2, y: Math.ceil(SCREEN_HEIGHT / TILE_SIZE) + 2 };
const TILE_SIZE_DESKTOP = SCREEN_WIDTH / 10;
const NUM_TILES_DESKTOP = { x: Math.ceil(SCREEN_WIDTH / TILE_SIZE_DESKTOP) + 2, y: Math.ceil(SCREEN_HEIGHT / TILE_SIZE_DESKTOP) + 2 };
const MAX_FPS = 120;
const FPS = 60;
const DECELERATION = 10;

const Background = memo(() => {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Background", "color: grey; font-size: 11px");

    //export default function Background() {
    // Contexts
    const { positionRef, speedRef, motion, prevMotion, gradient } = useContext(Data);

    // #################################################
    //   ACCELEROMETER TILT
    // #################################################

    // Current position
    const [prevGradient, setPrevGradient] = useState(gradient.get());

    // Current position
    const [position, setPosition] = useState(positionRef.current);

    // Current speed
    const [{ speed }, setSpeed] = useSpring(() => ({ speed: speedRef.current }));

    // Handle device orientation change
    const onDeviceMotion = ({ rotationRate }) => {
        const { alpha, beta } = rotationRate;

        // New motion
        var newMotion = {
            alpha: motion.current.alpha,
            beta: motion.current.beta,
        };

        // Update alpha
        if (Math.abs(alpha) > 20) {
            newMotion.alpha =
                (Math.sign(motion.current.alpha) === Math.sign(alpha) || motion.current.alpha === 0) && Math.abs(motion.current.alpha) > Math.abs(alpha) ? motion.current.alpha : alpha;
        }

        if (Math.abs(beta) > 20) {
            newMotion.beta = (Math.sign(motion.current.beta) === Math.sign(beta) || motion.current.beta === 0) && Math.abs(motion.current.beta) > Math.abs(beta) ? motion.current.beta : beta;
        }

        motion.current = newMotion;
    };

    // #################################################
    //   LOOP
    // #################################################

    const frameID = useRef(0);
    const frameCount = useRef(0);
    const lastFrameTime = useRef(Date.now());

    // Update actions
    const update = (deltaTime) => {
        // Frame deceleration
        const frameDesceleration = DECELERATION * deltaTime;

        // New speed same as old
        var newSpeed = { x: speed.get().x, y: speed.get().y };

        // Update x speed
        if (prevMotion.current.beta !== motion.current.beta) newSpeed.x = motion.current.beta;
        else if (newSpeed.x !== 0) newSpeed.x = newSpeed.x > 0 ? Math.max(newSpeed.x - frameDesceleration, 0) : Math.min(newSpeed.x + frameDesceleration, 0);

        // Update y speed
        if (prevMotion.current.alpha !== motion.current.alpha) newSpeed.y = motion.current.alpha;
        else if (newSpeed.y !== 0) newSpeed.y = newSpeed.y > 0 ? Math.max(newSpeed.y - frameDesceleration, 0) : Math.min(newSpeed.y + frameDesceleration, 0);

        // Set speed and save current motion
        if (prevMotion.current.beta !== motion.current.beta || prevMotion.current.alpha !== motion.current.alpha) prevMotion.current = motion.current;

        // Update speed
        if (newSpeed.x !== speedRef.current.x || newSpeed.y !== speedRef.current.y) {
            setSpeed({ speed: newSpeed });
            speedRef.current = newSpeed;
        }

        // Get te new position
        var newPosition = {
            x: positionRef.current.x + speed.get().x * deltaTime,
            y: positionRef.current.y + speed.get().y * deltaTime,
        };

        // Update position
        if (newPosition.x !== positionRef.current.x || newPosition.y !== positionRef.current.y) {
            setPosition(newPosition);
            positionRef.current = newPosition;
        }

        // Update Gradient
        if (prevGradient !== gradient.get()) setPrevGradient(gradient.get());
    };

    // Called every frame
    const loop = () => {
        frameCount.current++;

        if (frameCount.current >= Math.round(MAX_FPS / FPS)) {
            // Get delta time
            var currentTime = Date.now();
            var deltaTime = (currentTime - lastFrameTime.current) / 1000;
            lastFrameTime.current = currentTime;

            // Update
            update(deltaTime);
            frameCount.current = 0;
        }
        frameID.current = window.requestAnimationFrame(loop);
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        // Subscribe to events
        window.addEventListener("devicemotion", onDeviceMotion, true);

        // Start loop
        loop();

        // Unsubscribe from events and stop loop
        return () => {
            window.removeEventListener("devicemotion", onDeviceMotion, true);

            // Cancel animation
            if (frameID.current) window.cancelAnimationFrame(frameID.current);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    // Tile matrix
    var numTiles = isMobileOnly ? NUM_TILES : NUM_TILES_DESKTOP;
    var tileSize = isMobileOnly ? TILE_SIZE : TILE_SIZE_DESKTOP;

    var tiles = [];
    var xSize = numTiles.x * tileSize;
    var ySize = numTiles.y * tileSize;
    for (let i = 0; i < numTiles.x; i++) {
        for (let j = 0; j < numTiles.y; j++) {
            // Get X position
            var displX = position.x + i * tileSize;
            if (displX > 0) var xPos = (displX % xSize) - tileSize;
            else xPos = tileSize * (numTiles.x - 1) - (Math.abs(displX) % xSize);

            // Get Y position
            var displY = position.y + j * tileSize;
            if (displY > 0) var yPos = (displY % ySize) - tileSize;
            else yPos = tileSize * (numTiles.y - 1) - (Math.abs(displY) % ySize);

            tiles.push(<SVG key={`${i - 1}-${j - 1}`} className="cell" src={Icons} style={{ width: tileSize, transform: `translate(${xPos}px, ${yPos}px)`, opacity: 0.6 }} />);
        }
    }

    return (
        <div className="background" style={{ backgroundImage: gradient.get() }}>
            {tiles}
        </div>
    );
});

export default Background;
