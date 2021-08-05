
import './header.css';
import React from 'react';
import chevron from '../../images/chevron.svg';
import devXLogo from '../../images/devx_logo.svg';

import logoSisense from '../../images/logo_sisense.svg';

//#region Header
function Header(props: any = {}, ref: any) {

    return (
        <div className="header">
            <a className="floatLeft leftBorder headerA"
                target="_blank"
                href="https://www.sisense.com/"
                rel="noopener noreferrer">
                <img src={logoSisense} alt="Sisense Logo" />
            </a>

            <nav className="">
                <ol className="headerOl">
                    <li className="floatLeft headerLi">
                        <span>Embed Playground</span>
                    </li>
                    <span className="chevron floatLeft">
                        <img src={chevron} alt="chevron" />
                    </span>
                    {/* <li className="floatLeft">
                        <span>Iframe</span>
                    </li> */}
                </ol>
            </nav>

            <a className="floatRight headerA"
                target="_blank"
                href="https://sisense.dev/"
                rel="noopener noreferrer">
                <img src={devXLogo} alt="Sisense Logo" />
            </a>
        </div>
    );

}
//#endregion

export default React.forwardRef(Header);

