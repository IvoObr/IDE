import './css';
import React from 'react';
import { logger } from './lib';
import { CodeEditor, Header, Nav } from './components';

const code = `
function factorial(n1) {
    if (n1 < 0) return 'Maximum call stack size exceeded';
    if (n1 === 0) return 1;
    else return n1 * factorial(n1 - 1);
}

const num = 2 0;
const result = factorial(num);
console.log('The factorial of ', num.toString(), ' is', result);
//--------------------------------------------------
`;

export default class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Header/>
                <Nav/>
                <CodeEditor value={code} instance={null}/>
            </div>
        );
    }
}
