import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from "../components/Home/Home";
import SignUp from "../pages/SignUp";
import LogIn from "../pages/LogIn";
import HelloWorld from "../components/HelloWorld/HelloWorld";
import NotFound from "../components/App/NotFound";
import ForgetPassword from "../pages/ForgetPassword";
import ResetPassword from "../pages/ResetPassword";

const Routes = (props) => (
  <Switch>
    <Route exact path="/" component={Home}/>
    <Route path="/signup" component={SignUp} />
    <Route path="/login" component={LogIn} />
    <Route path="/helloworld" component={HelloWorld}/>
    <Route path="/forget-password" component={ForgetPassword}/>
    <Route path="/reset-password" component={ResetPassword}/>
    <Route component={NotFound}/>
  </Switch>
)

export default Routes;
