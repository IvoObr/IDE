import './css';
import React from 'react';
import { CodeMirror } from './components';

const code = `
const a = 0;
function mirror() {
    return a;
}
`;

export default class App extends React.Component {
    render() {
        return (
            <div className="App">
                <header className=""></header>

                <CodeMirror value={code}/>
            </div>
        );
    }
}
