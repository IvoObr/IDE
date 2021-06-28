
import '../css/index';
import 'codemirror/mode/meta';
import { logger } from '../lib';
import React from 'react';

//#region Terminal
function Terminal(props: any = {}, ref: any) {

    const { code } = props;

    return (<div className="container">
        <div className="Terminal">
            <div className="Terminal__body">
                <div className="Terminal__text"> <code>&gt; {code}</code></div>
                <div className="Terminal__Prompt">
                    {/* <span className="Prompt__user">cody@ubuntu:</span><span className="Prompt__location">~</span><span className="Prompt__dollar">$</span> */}
                    {/* <span className="Prompt__cursor"></span> */}
                </div>
            </div>
        </div>
    </div>);

}
//#endregion

export default React.forwardRef(Terminal);

