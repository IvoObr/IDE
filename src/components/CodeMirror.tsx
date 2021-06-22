import '../css/index';
import 'codemirror/mode/meta';
import { logger } from '../lib';
import CodeMirror from 'codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/mdn-like.css';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/display/autorefresh';
import React, { useRef, useEffect, useState,
    useImperativeHandle, useMemo } from 'react';

function ReactCodeMirror(props: any = {}, ref: any) {
    
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

    const textareaRef = useRef();
    const CM = CodeMirror as any;
    const value = props.value || '';
    const width = props.width || '100%';
    const height = props.height || '100%';
    const [editor, setEditor]: any = useState();
    useImperativeHandle(ref, () => ({ editor }), [editor]);

    function getEventHandleFromProps() {
        const propNames = Object.keys(props);
        const eventHandle = propNames.filter((keyName) => /^on+/.test(keyName));

        const eventDict: any = {};
        eventHandle.forEach((el) => {
            const name = el.slice(2);
            const name2 = name[0];
            if (name && name2) {
                eventDict[el] = name.replace(name2, name2.toLowerCase());
            }
        });

        return eventDict;
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
            
            Object.keys(eventDict).forEach((event) => 
                instance.on(eventDict[event], props[event]));

            instance.setValue(value || '');
            (width || height) && instance.setSize(width, height);
 
            setEditor(instance);
            setOptions(instance, { ...options });
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
        setOptions(editor, { ...options });

    }, [editor, options]);

    return (
        <textarea ref={textareaRef as any} />
    );
}

export default React.forwardRef(ReactCodeMirror);