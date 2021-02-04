import React, { useContext } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import Landing from "pages/Landing";
import Home from "pages/Home";
import Background from "components/Background";

// Contexts
import { Utils } from "./contexts/Utils";

export default function App() {
    // Contexts
    const { setCookie, getCookie } = useContext(Utils);

    // Dark mode
    setCookie("matcheat_dark_mode", 1);
    if (getCookie("matcheat_dark_mode") !== "0") document.body.classList.add("dark");

    return (
        <div className="app">
            {/* <div className="background"></div> */}
            <Background />

            <Router>
                <Switch>
                    {/* ################################# */}
                    {/*   HOME PAGE                       */}
                    {/* ################################# */}
                    <Route path="/home" component={Home}></Route>

                    {/* ################################# */}
                    {/*   LANDING PAGE                    */}
                    {/* ################################# */}
                    <Route path="/" component={Landing}></Route>
                </Switch>
            </Router>
        </div>
    );
}
