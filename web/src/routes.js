import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Dashboard from './Pages/Dashboard';
import Edit from './Pages/Edit';

export default function Routes(){
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={Dashboard} exact />
                <Route path="/edit" component={Edit} />
            </Switch>
        </BrowserRouter>
    )
}