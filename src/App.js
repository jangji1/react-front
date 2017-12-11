import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Sample1 from './pages/Sample1';
import Sample2 from './pages/Sample2';
import Search from './pages/Search';
import NotFound from './pages/NotFound';
import { default as GradesupFocusLearnMain } from './pages/gradesup/focus/learn/Main';
import { default as Pluszone } from './pages/pluszone/Pluszone';

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/page1/:name" component={Page1}/>
                    <Route path="/page2" component={Page2}/>
                    <Route path="/sample1" component={Sample1}/>
                    <Route path="/sample2" component={Sample2}/>
                    <Route path="/search" component={Search}/>
                    <Route path="/mypage" component={MyPage}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/search" component={Search}/>
                    <Route path="/pluszone/:elearnCourseId" component={Pluszone}/>
                    <Route path="/gradesup/focus/learn/main" component={GradesupFocusLearnMain}/>
                    <Route component={NotFound}/>
                </Switch>
            </Router>
        )
    }
}

export default App;