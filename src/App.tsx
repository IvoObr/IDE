import React from 'react';
import { Header, Nav, MainSection } from './components';

export default class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Header/>
                <Nav />
                <MainSection/>
            </div>
        );
    }
}
