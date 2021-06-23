import '../css/index';
import 'codemirror/mode/meta';
import { logger } from '../lib';
import 'codemirror/keymap/sublime';
import CodeMirror from 'codemirror';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/mdn-like.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/hint/javascript-hint.js';
import React, { useRef, useEffect, useState,
    useImperativeHandle, useMemo } from 'react';

let result: any;

//#region Component
function CodeMirrorCom(props: any = {}, ref: any) {

    const options = {
        tabSize: 2,
        keyMap: 'sublime',
        lineNumbers: true,
        mode: 'javascript',
        matchBrackets: true,
        styleActiveLine: true,
        autoCloseBrackets: true,
        showCursorWhenSelecting: true,
        theme: 'mdn-like' // 'monokai'
    };

    const CM = CodeMirror as any;
    const value = props.value || '';
    const textareaRef: any = useRef();
    const width = props.width || '100%';
    const height = props.height || '100%';
    const [editor, setEditor]: any = useState();
    useImperativeHandle(ref, () => ({ editor }), [editor]);

    function getEventHandleFromProps(): any {
        const propNames = Object.keys(props);
        const eventHandle = propNames.filter((keyName) => /^on+/.test(keyName));

        return {
            dict: () => eventHandle.map((el) => {
                const name = el.slice(2);
                const name2 = name[0];
                const dict: any = {};
                if (name && name2) {
                    dict[el] = name.replace(name2, name2.toLowerCase());
                }
                return dict;
            })
        };
    }

    async function setOptions(instance: any, opt: any = {}) {
        if (typeof opt === 'object' && window) {
            const mode = CM.findModeByName(opt.mode || '');

            (mode) && (opt.mode = mode.mime);
            (mode?.mode) && await import(`codemirror/mode/${mode.mode}/${mode.mode}.js`);

            Object.keys(opt).forEach((name) => 
                (opt[name] && JSON.stringify(opt[name])) &&
                    instance.setOption(name, opt[name]));
        }
    }

    useEffect(() => {
        if (!editor && window) {
            const eventDict = getEventHandleFromProps();
            const ref = textareaRef.current as unknown as HTMLTextAreaElement;
            const instance = CM.fromTextArea(ref, { ...options });
            result = { ...instance };

            instance.on("keydown", function(codemirror: any, event: any) {
                if (event.ctrlKey && event.code === 'Space') {
                    instance.showHint(instance);
                }
            });
        
            /**
                var textArea = document.getElementById('myScript');
                var editor = CodeMirror.fromTextArea(textArea);
                editor.getDoc().setValue('var msg = "Hi";');
             */
            Object.keys(eventDict).forEach((event) => 
                instance.on(eventDict[event], props[event]));

            instance.setValue(value || '');
            (width || height) && instance.setSize(width, height);
 
            setEditor(instance);
            setOptions(instance, { ...options });

            // fixme: console.log(instance.getValue()); 
            
        }

        return () => {
            if (editor && window) {
                editor.toTextArea();
                setEditor(undefined);
            }
        };
    }, []);

    useMemo(() => {
        if (!editor || !window) return;
        const val = editor.getValue();
        (value && value !== val) && editor.setValue(value);
    }, [value]);

    useMemo(() => {
        if (!editor || !window) return;
        editor.setSize(width, height);
    }, [width, height]);

    useMemo(() => {
        if (!editor || !window) return;
        setOptions(editor, { ...options });
    }, [editor, options]);

    function run() {
        try {
            const value = result?.doc.cm.getValue();
        
            const code = eval(value);
            console.log(code);

            // result.doc.cm.setValue(value);
        
            // const ter: any = document.getElementById("console");
            // console.log(ter.value);
            // ter.defaultValue = code;
        } catch (error) {
            logger.error(error);
        }
    }

    // let codeEval;

    // useState({ codeEval: code })

    return (
        <div>
            <textarea id="editor" ref={textareaRef}/>;
            <button className="btn btn-primary"
                style={{ "width": "20%" }} id="run"
                onClick={run}>Run</button>

        </div>
    );
}
//#endregion

export default React.forwardRef(CodeMirrorCom);