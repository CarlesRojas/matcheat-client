import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import Landing from "pages/Landing";
import Auth from "pages/Auth";
import Home from "pages/Home";
import Background from "components/Background";

export default function App() {
    return (
        <div className="app">
            <Background />

            <Router>
                <Switch>
                    {/* ################################# */}
                    {/*   HOME PAGE                       */}
                    {/* ################################# */}
                    <Route path="/home" component={Home}></Route>

                    {/* ################################# */}
                    {/*   AUTH PAGE                    */}
                    {/* ################################# */}
                    <Route path="/auth" component={Auth}></Route>

                    {/* ################################# */}
                    {/*   LANDING PAGE                    */}
                    {/* ################################# */}
                    <Route path="/" component={Landing}></Route>
                </Switch>
            </Router>
        </div>
    );
}
