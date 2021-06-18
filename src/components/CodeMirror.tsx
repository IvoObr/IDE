// import React from 'react';

// export default class Ide extends React.Component {
//     render() {
     
//         return (
     
//             <div className="code-container">
//                 <textarea id='editor'>
                  
//                 </textarea>
//             </div>
//         );
//     }
// }

import React, { useRef, useEffect, useImperativeHandle, useState, useMemo } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/mode/meta';
import '../css';

const defaultOptions = {
    tabSize: 2,
    autoCloseBrackets: true,
    matchBrackets: true,
    showCursorWhenSelecting: true,
    lineNumbers: true,
    fullScreen: true
};

function ReactCodeMirror(props: any = {}, ref: any) {
    const options = {} || props.options;
    const value = '' || props.value;
    const width = '100%' || props.width;
    const height = '100%' || props.height;

    const [editor, setEditor]: [any, any] = useState();
    const textareaRef = useRef();
    useImperativeHandle(ref, () => ({ editor }), [editor]);
    function getEventHandleFromProps() {
        const propNames = Object.keys(props);
        const eventHandle = propNames.filter((keyName) => {
            return /^on+/.test(keyName);
        });

        const eventDict: any = {};
        eventHandle.forEach((el) => {
            const name = el.slice(2);
            if (name && name[0]) {
                eventDict[el] = name.replace(name[0], name[0].toLowerCase());
            }
        });

        return eventDict;
    }

    async function setOptions(instance: any, opt: any = {}) {
        if (typeof opt === 'object' && window) {
            const mode = CodeMirror.findModeByName(opt.mode || '');
            if (mode && mode.mode) {
                await import(`codemirror/mode/${mode.mode}/${mode.mode}.js`);
            }
            if (mode) {
                opt.mode = mode.mime;
            }
            Object.keys(opt).forEach((name) => {
                if (opt[name] && JSON.stringify(opt[name])) {
                    instance.setOption(name, opt[name]);
                }
            });
        }
    }

    useEffect(() => {
        if (!editor && window) {
            const instance = CodeMirror.fromTextArea(
                textareaRef.current as unknown as HTMLTextAreaElement,
                { ...defaultOptions, ...options });
            const eventDict = getEventHandleFromProps();
            Object.keys(eventDict).forEach((event) => {
                instance.on(eventDict[event], props[event]);
            });
            instance.setValue(value || '');

            if (width || height) {
                instance.setSize(width, height);
            }
            setEditor(instance as any);
            setOptions(instance, { ...defaultOptions, ...options });
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
        if (value !== undefined && value !== val) {
            editor.setValue(value);
        }
    }, [value]);

    useMemo(() => {
        if (!editor || !window) return;
        editor.setSize(width, height);
    }, [width, height]);

    useMemo(() => {
        if (!editor || !window) return;
        setOptions(editor, { ...defaultOptions, ...options });
    }, [editor, options]);

    return (
        <textarea ref={textareaRef as any} />
    );
}

export default React.forwardRef(ReactCodeMirror);