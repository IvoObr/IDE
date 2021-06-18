import './css';
import React from 'react';
import { CodeMirror } from './components';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/mdn-like.css';

const code = 'const a = 0;';


export default class App extends React.Component {
    render() {
        return (
            <div className="App">
                <header className=""></header>
             
                
                <CodeMirror
                    value={code}
                    options={{
                        theme: 'mdn-like',
                        tabSize: 2,
                        keyMap: 'sublime',
                        mode: 'js',
                    }}
                />
            </div>
        );
    }
}
