
import '../css/index';
import React from 'react';

//#region Header
function Header(props: any = {}, ref: any) {

    // const { code } = props;

    return (
        <div className="nav">
            <nav className="">
                <ol className="">
                    <li className="floatLeft">
                        <span>Embed Playground</span>
                    </li>
            
                </ol>
            </nav>
        </div>
    );

}
//#endregion

export default React.forwardRef(Header);

