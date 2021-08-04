
import './nav.css';
import React, { useState } from 'react';
import home from '../../images/home.svg';
import iframe from '../../images/iframe.svg';
import embedSdk from '../../images/embedSdk.svg';
import sisenseJs from '../../images/sisenseJs.svg';

//#region Nav
function Nav(props: any = {}, ref: any) {

    const [visibleText, setTextVisibility] = useState(false);

    function showText() {
        setTextVisibility(true);
    }

    function hideText() {
        setTextVisibility(false);
    }

    return (
        <div className="nav"
            onMouseOver={showText}
            onMouseLeave={hideText}>
            <ol className="">
                <li className="navLi">
                    <a className="">
                        <img src={home} alt="Sisense Logo" />
                    </a>
                    <span
                        className={`navText ${visibleText ? "visible" : ""}`}>Intro</span>
                </li>

                <li className="navLi">
                    <a className="">
                        <img src={iframe} alt="iframe" />
                    </a>
                    <span
                        className={`navText ${visibleText ? "visible" : ""}`}>Iframe</span>
                </li>

                <li className="navLi">
                    <a className="">
                        <img src={embedSdk} alt="embedSdk" />
                    </a>
                    <span
                        className={`navText ${visibleText ? "visible" : ""}`}>Embed SDK</span>
                </li>

                <li className="navLi">
                    <a className="">
                        <img src={sisenseJs} alt="sisenseJs" />
                    </a>
                    <span
                        className={`navText ${visibleText ? "visible" : ""}`}>SisenseJS</span>
                </li>
            </ol>
        </div>
    );

}
//#endregion

export default React.forwardRef(Nav);

