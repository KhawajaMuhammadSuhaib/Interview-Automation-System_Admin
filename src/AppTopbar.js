import React from 'react';
import { Link } from 'react-router-dom';
export const AppTopbar = (props) => {

    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
                <span>Interview Automation System</span>
            </Link>
        </div>
    );
}
