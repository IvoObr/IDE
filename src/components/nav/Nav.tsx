
import './nav.css';
import React from 'react';
import home from '../../images/home.svg';

//#region Header
function Header(props: any = {}, ref: any) {

    // const { code } = props;

    return (
        <div className="nav">
            {/* <nav className=""> */}
            <ol className="">
                <li className="floatLeft">
                    <a className="">
                        <img src={home} alt="Sisense Logo" />
                    </a>
                </li>
            
            </ol>
            {/* </nav> */}
        </div>
    );

}
//#endregion

export default React.forwardRef(Header);

