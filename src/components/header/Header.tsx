
import './header.css';
import React from 'react';
import { logger } from '../../lib';
import devXLogo from '../../images/devx_logo.svg';
import logoSisense from '../../images/logo_sisense.svg';

//#region Header
function Header(props: any = {}, ref: any) {

    // const { code } = props;

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
                        <svg className="chevron floatLeft">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>                    </span>
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

