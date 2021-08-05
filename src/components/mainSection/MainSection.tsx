
import React from 'react';
import './mainSection.css';
import 'codemirror/mode/meta';
import CodeEditor from '../codeEditor/CodeEditor';
import { logger } from '../../lib';

const code = `
function factorial(n1) {
    if (n1 < 0) return 'Maximum call stack size exceeded';
    if (n1 === 0) return 1;
    else return n1 * factorial(n1 - 1);
}

const num = 20;
const result = factorial(num);
console.log('The factorial of ', num.toString(), ' is', result);
`;

//#region MainSection
function MainSection(props: any = {}, ref: any) {

    return (
        <div className="mainSection">
            <table className="table">
                <tr>
                    <td className="apiSection">

                    </td>
                    <td className="previewSection" rowSpan={2}>

                    </td>
                </tr>
                <tr>
                    <td className="codeEditSection">
                        <CodeEditor value={code} instance={null} />
                    </td>
                </tr>
            </table>
        </div>
    );

}
//#endregion todo: 

export default React.forwardRef(MainSection);

