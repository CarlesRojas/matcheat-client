import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

// Pages
import OnlyMobile from "pages/OnlyMobile";
import Settings from "pages/Settings";
import Ranking from "pages/Ranking";
import Wait from "pages/Wait";
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
                    {/*   ONLY MOBILE                     */}
                    {/* ################################# */}
                    <Route path="/onlyMobile" component={OnlyMobile} exact></Route>

                    {/* ################################# */}
                    {/*   SETTINGS                        */}
                    {/* ################################# */}
                    <Route path="/settings" component={Settings} exact></Route>

                    {/* ################################# */}
                    {/*   WAIT                            */}
                    {/* ################################# */}
                    <Route path="/ranking" component={Ranking} exact></Route>

                    {/* ################################# */}
                    {/*   WAIT                            */}
                    {/* ################################# */}
                    <Route path="/wait" component={Wait} exact></Route>

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
