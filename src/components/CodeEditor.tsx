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
import React, { useRef, useEffect, useState, useImperativeHandle } from 'react';

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
            setValue(instance);
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

    function focus(ref: any, instance: any) {
        ref.addEventListener('click', () => instance.focus());
        instance.focus();
    }

    function createInstance(ref: any) {
        return ide.fromTextArea(ref, { ...options });
    }

    function onKeyDown(instance: any) {
        instance.on("keydown",
            function(space: unknown, event: any) {
                if (!event.ctrlKey) return;
                if (event.key === "Alt") run();
                if (event.code === "Space") instance.showHint(instance);
            });
    }

    function setValue(instance: any) {
        instance.setValue(value || '');
        (width || height) && instance.setSize(width, height);
    }

    function executeCode(code: string) {
        try {
            (new Function(code))();
        } catch (error) {
            logger.error(error);
        }
    }

    function run() {
        let output = '';
        const log = console.log; // original log fixme:
        try {
            const value = (ideInstance as any)?.doc.cm.getValue();
            console.log = function(...args) {
                args.forEach((chunk) => {
                    output += (' ' + (chunk || ''));
                    chunk && setCode(output);
                });
            };
            log(executeCode(value));

        } catch (error) {
            // log(executeCode(error)); todo:
            logger.error(error);
        }
    }

    return (
        <div>
            <p className="hotkeys">Ctrl + Space for intellisense</p>
            <p className="hotkeys">Ctrl + Alt to compile</p>
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