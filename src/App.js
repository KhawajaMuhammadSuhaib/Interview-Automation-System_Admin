import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Route, Redirect } from 'react-router-dom';

import { AppTopbar } from './AppTopbar';
import { AppMenu } from './AppMenu';

import { Dashboard } from './components/Dashboard';
import { ChartDemo } from './components/ChartDemo';
import { Companies } from './components/Companies';
import { Jobs } from './components/Jobs';
import { Applicants } from './components/Applicants';
import { Complaints } from './components/Complaints';
import { Subscriptions } from './components/Subscriptions';
import Login from './components/Login';
import Logout from './components/Logout';

import UserContext from './Context/User';
import PrimeReact from 'primereact/api';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './layout/flags/flags.css';
import './layout/layout.scss';
import './App.scss';

const App = () => {
    const [user, setUser] = useState(null)
    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('light')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('admin'))
        if (!data)
            return
        setUser(data)
    }, [])

    PrimeReact.ripple = true;
    const [scale, setScale] = useState(14);
    useEffect(() => {
        document.documentElement.style.fontSize = scale + 'px';
    }, [scale])

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

    const menu = [
        {
            label: 'Admin',
            items: [
                {
                    label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/'
                },
                {
                    label: 'Companies', icon: 'pi pi-fw pi-users', to: '/companies'
                },
                {
                    label: 'Jobs', icon: 'pi pi-fw pi-briefcase', to: '/jobs'
                },
                {
                    label: 'Applicants', icon: 'pi pi-fw pi-user', to: '/applicants'
                },
                {
                    label: 'Complaints', icon: 'pi pi-fw pi-comments', to: '/complaints'
                },
                {
                    label: 'Subscriptions', icon: 'pi pi-fw pi-shopping-cart', to: '/subscriptions'
                },
                {
                    label: 'Sign out', icon: 'pi pi-fw pi-sign-out', to: '/login'
                },
            ]
        },

    ];

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });


    return (
        <UserContext.Provider value={{ user, setUser }}>
                <Route path="/login" component={Login} />
                {
                    !user ?
                        <>
                            <Route path="/" exact component={Dashboard}>
                                <Redirect to="/login"/>
                            </Route>
                            <Route path="/companies" component={Companies} >
                                <Redirect to="/login"/>
                            </Route>
                            <Route path="/applicants" component={Applicants} >
                                <Redirect to="/login"/>
                            </Route>
                            <Route path="/complaints" component={Complaints} >
                                <Redirect to="/login"/>
                            </Route>
                            <Route path="/jobs" component={Jobs} >
                                <Redirect to="/login"/>
                            </Route>
                            <Route path="/subscriptions" component={Subscriptions} >
                                <Redirect to="/login"/>
                            </Route>
                        </>

                        :
                        <div className={wrapperClass} onClick={onWrapperClick}>
                            <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode}
                                mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />
                            <div className="layout-sidebar" onClick={onSidebarClick}>
                                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
                            </div>

                            <div className="layout-main-container">
                                <div className="layout-main">
                                    <Route path="/" exact component={Dashboard} />
                                    <Route path="/companies" component={Companies} />
                                    <Route path="/applicants" component={Applicants} />
                                    <Route path="/complaints" component={Complaints} />
                                    <Route path="/jobs" component={Jobs} />
                                    <Route path="/subscriptions" component={Subscriptions} />
                                    <Route path="/chart" component={ChartDemo} />
                                    <Route path="/logour" component={Logout} />
                                    <Route path='/login'>
                                        <Redirect to='/' exact />
                                    </Route>
                                </div>
                            </div>
                        </div>
                }
        </UserContext.Provider>
    );

}

export default App;
