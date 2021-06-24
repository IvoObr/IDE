import '../css/index';
import 'codemirror/mode/meta';
import { logger } from '../lib';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/mdn-like.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/hint/javascript-hint.js';
import CodeMirror, { EditorFromTextArea } from 'codemirror';
import React, {
    useRef, useEffect, useState,
    useImperativeHandle, useMemo
} from 'react';

let ideInstance: EditorFromTextArea;

//#region Component
function CodeEditor(props: any = {}, ref: any) {

    const options = {
        tabSize: 2,
        gutters: [],
        autofocus: true,
        foldGutter: true,
        keyMap: 'sublime',
        lineNumbers: true,
        lineWrapping: true,
        mode: 'javascript',
        matchBrackets: true,
        styleActiveLine: true,
        autoCloseBrackets: true,
        styleSelectedText: true,
        showCursorWhenSelecting: true,
        theme: 'mdn-like', // 'monokai',
        highlightSelectionMatches: {
            showToken: /\w/, annotateScrollbar: true
        }
    };

    const ide = CodeMirror as any;
    const value = props.value || '';
    const textareaRef: any = useRef();

    const width = props.width || '100%';
    const height = props.height || '100%';
    const [code, setCode]: any = useState();
    const [editor, setEditor]: any = useState();
    useImperativeHandle(ref, () => ({ editor }), [editor]);

    useEffect(() => {
        if (!editor && window) {
            const ref = textareaRef.current as unknown as HTMLTextAreaElement;
            const instance = createInstance(ref);
            ideInstance = { ...instance };

            focus(ref, instance);
            onKeyDown(instance);
            setEventDict(instance);
            setInstanceOptions(instance);
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

    useMemo(async () => {
        if (!editor || !window) return;
        await setOptions(editor, { ...options });
    }, [editor, options]);

    async function setOptions(instance: any, opt: any = {}) {
        try {
            if (typeof opt === 'object' && window) {
                const mode = ide.findModeByName(opt.mode || '');

                (mode) && (opt.mode = mode.mime);
                (mode?.mode) && await import(`codemirror/mode/${mode.mode}/${mode.mode}.js`);

                Object.keys(opt).forEach((name) =>
                    (opt[name] && JSON.stringify(opt[name])) &&
                    instance.setOption(name, opt[name]));
            }
        } catch (error) {
            logger.error(error);
        }
    }

    function getEventHandleFromProps(): any {
        return {
            dict: () => {
                const propNames = Object.keys(props);
                const eventHandle = propNames.filter((keyName) => /^on+/.test(keyName));
                return eventHandle.map((el) => {
                    const name = el.slice(2);
                    const name2 = name[0];
                    if (name && name2) {
                        return name.replace(name2, name2.toLowerCase());
                    }
                });
            }
        };
    }

    function focus(ref: any, instance: any) {
        ref.addEventListener('click', () => instance.focus());
        instance.focus();
    }

    function createInstance(ref: any) {
        return ide.fromTextArea(ref, { ...options });
    }

    function onKeyDown(instance: any) {
        instance.on("keydown",
            function(codemirror: any, event: any) {
                if (event.ctrlKey && event.code === 'Space') {
                    instance.showHint(instance);
                }
            });
    }

    function setInstanceOptions(instance: any) {
        instance.setValue(value || '');
        (width || height) && instance.setSize(width, height);

    }

    function setEventDict(instance: any) {
        const eventDict = getEventHandleFromProps();
        Object.keys(eventDict).forEach((event) =>
            instance.on(eventDict[event], props[event]));
    }

    function executeCode(code: string) {
        try {
            (new Function(code))();
        } catch (error) {
            logger.error(error);
        }
    }

    function run() {
        const log = console.log;
        try {
            const value = (ideInstance as any)?.doc.cm.getValue();

            logger.warn(value);

            console.log = function(...args) {
                let res = '';
                logger.info(args);
                args.forEach((output) => {
                    if (output) {
                        res += ' ' + output;
                        setCode(res);
                    }
                });
            };

            log(executeCode(value));
        } catch (error) {
            // log(executeCode(error)); fixme:
            logger.error(error);
        }
    }

    return (
        <div>
            <p className="hotkeys">Ctrl + Space for intellisense</p>
            <textarea id="editor" ref={textareaRef} />
            <br/>
            <button className="btno" id="run" onClick={run}>Run</button>
            <br/><br/>
            <div id="console" className="output"><code>&gt; {code}</code></div>
        </div>
    );
}
//#endregion

export default React.forwardRef(CodeEditor);