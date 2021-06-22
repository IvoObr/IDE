import '../css/index';
import 'codemirror/mode/meta';
import { logger } from '../lib';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/mdn-like.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/display/autorefresh';
import React, { useRef, useEffect, useState,
    useImperativeHandle, useMemo } from 'react';
import CodeMirror, { EditorFromTextArea } from 'codemirror';

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

    const textareaRef = useRef();
    const CM = CodeMirror as any;
    const value = props.value || '';
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

    function snippet(instance: any): void {
        CodeMirror.showHint(instance, function(): any {
            const cursor = instance.getCursor();
            const token = instance.getTokenAt(cursor);
            const end: number = cursor.ch;
            const line: number = cursor.line;
            const start: number = token.start;

            return {
                list: [],
                from: CodeMirror.Pos(line, start),
                to: CodeMirror.Pos(line, end)
            };
        }, { completeSingle: false });
    }

    async function setOptions(instance: any, opt: any = {}) {
        if (typeof opt === 'object' && window) {
            const mode = CM.findModeByName(opt.mode || '');

            (mode) && (opt.mode = mode.mime);
            (mode?.mode) && await import(`codemirror/mode/${mode.mode}/${mode.mode}.js`);

            instance.setOption('extraKeys', {
                'Ctrl-Space': () => snippet(instance)
            });

            Object.keys(opt).forEach((name) => 
                (opt[name] && JSON.stringify(opt[name])) &&
                    instance.setOption(name, opt[name]));
        }
    }

    useEffect(() => {
        if (!editor && window) {
            const eventDict = getEventHandleFromProps();

            logger.info(eventDict);

            const ref = textareaRef.current as unknown as HTMLTextAreaElement;
            const instance: EditorFromTextArea = CM.fromTextArea(ref, { ...options });
            
            // TODO: instance. todo

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

    return <textarea ref={textareaRef as any} />;
}
//#endregion

export default React.forwardRef(CodeMirrorCom);