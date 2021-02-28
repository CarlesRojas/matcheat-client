import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

// Pages
import Restaurants from "pages/Restaurants";
import Loading from "pages/Loading";
import JoinRoom from "pages/JoinRoom";
import CreateRoom from "pages/CreateRoom";
import Home from "pages/Home";
import Auth from "pages/Auth";
import Landing from "pages/Landing";

// Components
import Background from "components/Background";

export default function App() {
    return (
        <div className="app">
            <Background />

            <Router>
                <Switch>
                    {/* ################################# */}
                    {/*   RESTAURANTS                     */}
                    {/* ################################# */}
                    <Route path="/restaurants" component={Restaurants} exact></Route>

                    {/* ################################# */}
                    {/*   LOADING                         */}
                    {/* ################################# */}
                    <Route path="/loading" component={Loading} exact></Route>

                    {/* ################################# */}
                    {/*   JOIN ROOM                       */}
                    {/* ################################# */}
                    <Route path="/joinRoom" component={JoinRoom} exact></Route>

                    {/* ################################# */}
                    {/*   CREATE ROOM PAGE                */}
                    {/* ################################# */}
                    <Route path="/createRoom" component={CreateRoom} exact></Route>

                    {/* ################################# */}
                    {/*   HOME PAGE                       */}
                    {/* ################################# */}
                    <Route path="/home" component={Home} exact></Route>

                    {/* ################################# */}
                    {/*   AUTH PAGE                       */}
                    {/* ################################# */}
                    <Route path="/auth" component={Auth} exact></Route>

                    {/* ################################# */}
                    {/*   LANDING PAGE                    */}
                    {/* ################################# */}
                    <Route path="/" component={Landing} exact></Route>
                </Switch>
            </Router>
        </div>
    );
}
