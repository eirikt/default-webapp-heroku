/* global window, document, console, setTimeout */

/* eslint-disable no-console */
/* eslint-disable no-mixed-requires */
/* eslint-disable no-alert */

/* eslint complexity: [1, 1] */
/* eslint newline-after-var: 1 */

import React from 'react';
import ReactDOM from 'react-dom';

import AppCacheUpdateReady from './appcache-updateready.jsx';

import Title from './title.jsx';
import NetworkStatus from './network-status.jsx';

const fadingDuration = 1000;

// UI Component structure:
// -------------------------------
// Content
//     Header
//         Title
//         StatusContainer
//
//     MainContentPlaceholder
//
//     Footer
//         ApplicationLabel
//         ApplicationBuiltLabel
//         DevelopmentLabel
// -------------------------------

const ConnectionStatus = React.createClass({
    removeAllFadingClasses: function(el) {
        el.classList.remove('fadein-connection-status-disconnected');
        el.classList.remove('fadeout-connection-status-disconnected');
        el.classList.remove('fadein-connection-status-connected');
        el.classList.remove('fadeout-connection-status-connected');
    },
    fadeinConnection: function() {
        const el = this.refs.connectionStatus;
        this.removeAllFadingClasses(el);
        if (window.connected) {
            el.classList.add('fadein-connection-status-connected');
        } else {
            el.classList.add('fadeout-connection-status-disconnected');
            setTimeout(() => {
                el.classList.remove('fadeout-connection-status-disconnected');
                el.classList.add('fadein-connection-status-connected');
            }, fadingDuration);
        }
        Array.prototype.forEach.call(document.getElementsByClassName('connected-only'), (connectedOnlyElements) => {
            connectedOnlyElements.classList.remove('fadeout');
            connectedOnlyElements.classList.add('fadein');
            setTimeout(() => {
                connectedOnlyElements.removeAttribute('hidden');
            }, fadingDuration);
        });
    },
    fadeoutConnection: function() {
        const el = this.refs.connectionStatus;
        this.removeAllFadingClasses(el);
        if (window.connected) {
            el.classList.add('fadeout-connection-status-connected');
            setTimeout(() => {
                el.classList.remove('fadeout-connection-status-connected');
                el.classList.add('fadein-connection-status-disconnected');
            }, fadingDuration);
        } else {
            el.classList.add('fadein-connection-status-disconnected');
        }
        Array.prototype.forEach.call(document.getElementsByClassName('connected-only'), (connectedOnlyElements) => {
            connectedOnlyElements.classList.remove('fadein');
            connectedOnlyElements.classList.add('fadeout');
            setTimeout(() => {
                connectedOnlyElements.setAttribute('hidden', 'true');
                connectedOnlyElements.classList.remove('fadeout');
            }, fadingDuration);
        });
    },
    render: function() {
        console.log('React :: ConnectionStatus component: rendering ...');
        return (
            <span ref='connectionStatus'></span>
        );
    },
    componentDidMount: function() {
        console.log('React :: ConnectionStatus component: mounted ...');
        window.addEventListener('connected', this.fadeinConnection, false);
        window.addEventListener('disconnected', this.fadeoutConnection, false);
        window.addEventListener('connection-failed', this.fadeoutConnection, false);
        window.addEventListener('connection-error', this.fadeoutConnection, false);
    },
    componentWillUnmount: function() {
        console.log('React :: ConnectionStatus component: unmounted ...');
        window.removeEventListener('connected', () => {
            console.log('React :: ConnectionStatus component: \'connected\' event listener removed ...');
        }, false);
        window.removeEventListener('disconnected', () => {
            console.log('React :: ConnectionStatus component: \'disconnected\' event listener removed ...');
        }, false);
        window.removeEventListener('connection-failed', () => {
            console.log('React :: ConnectionStatus component: \'connection-failed\' event listener removed ...');
        }, false);
        window.removeEventListener('connection-error', () => {
            console.log('React :: ConnectionStatus component: \'connection-error\' event listener removed ...');
        }, false);
    }
});

const ConnectionCount = React.createClass({
    render: function() {
        console.log('React :: ConnectionCount component: rendering ...');
        return (
            <span className='connected-only connection-count' ref='connectionCount'></span>
        );
    },
    componentDidMount: function() {
        console.log('React :: ConnectionCount component: mounted ...');
        const el = this.refs.connectionCount;

        window.addEventListener('connection-count', (event) => {
            const connectionCount = event.detail.connectionCount;
            console.log('React :: ConnectionCount component: CONNECTIONCOUNT received ... (' + JSON.stringify(event.detail) + ')');
            el.classList.remove('fadein');
            el.classList.add('fadeout');
            setTimeout(() => {
                if (connectionCount === 1) {
                    el.textContent = 'You\'re the only user connected ...';
                } else {
                    el.textContent = connectionCount + ' active connections';
                }
                el.classList.remove('fadeout');
                el.classList.add('fadein');
            }, fadingDuration);
        }, false);
    },
    componentWillUnmount: function() {
        console.log('React :: ConnectionCount component: unmounted ...');
        window.removeEventListener('connection-count', () => {
            console.log('React :: ConnectionCount component: \'connection-count\' event listener removed ...');
        }, false);
    }
});

const StatusContainer = React.createClass({
    render: function() {
        return (
            <section className='status-container'>
                <section>
                    <section className='network-status-container'></section>
                    <section className='connection-status-container'>
                        <ConnectionCount/>
                    </section>
                </section>
                <section>
                    <section className='network-status-container'>
                        <NetworkStatus fadingDuration={fadingDuration}/>
                    </section>
                    <section className='connection-status-container'>
                        <ConnectionStatus/>
                    </section>
                </section>
            </section>
        );
    }
});

const Header = React.createClass({
    render: function() {
        return (
            <header>
                <section>
                    <Title title={this.props.appTitle}/>
                    <StatusContainer/>
                </section>
                <hr/>
            </header>
        );
    }
});

const MainContentPlaceholder = React.createClass({
    render: function() {
        return (
            <section className='watermark'>some content ...</section>
        );
    }
});

const ApplicationLabel = React.createClass({
    render: function() {
        return (
            <span>{this.props.appTitle}&nbsp;v{this.props.appVersion}</span>
        );
    }
});

const ApplicationBuiltLabel = React.createClass({
    render: function() {
        return (
            <span>built&nbsp;{this.props.appBuildTimestamp}</span>
        );
    }
});

const DevelopmentLabel = React.createClass({
    render: function() {
        if (this.props.appBuildConfiguration === 'development') {
            return (
                <span className='development'>Development configuration</span>
            );
        }
        return false;
    }
});

const ESLintStatus = ({ errors, warnings }) => (
    <section>
        <span className='error-badge'>
            <span>JS errors</span>
            <span className='pill'>{ errors }</span>
        </span>
        <span>&nbsp;</span>
        <span className='warning-badge'>
            <span>JS warnings</span>
            <span className='pill'>{ warnings }</span>
        </span>
    </section>
);

const ScssLintStatus = ({ warnings }) => (
    <section>
        <span className='warning-badge'>
            <span>CSS warnings</span>
            <span className='pill'>{ warnings }</span>
        </span>
    </section>
);

const Footer = React.createClass({
    render: function() {
        return (
            <footer>
                <hr/>
                <section>
                    <ApplicationLabel appTitle={this.props.appTitle} appVersion={this.props.appVersion}/>
                    <ApplicationBuiltLabel appBuildTimestamp={this.props.appBuildTimestamp}/>
                    <DevelopmentLabel appBuildConfiguration={this.props.appBuildConfiguration}/>
                </section>
                <section>
                    <ESLintStatus errors={this.props.eslintErrors} warnings={this.props.eslintWarnings}/>
                    <ScssLintStatus warnings={this.props.scsslintWarnings}/>
                </section>
                <section>
                    <a href='https://www.codacy.com/app/eiriktorske/default-webapp-heroku'>
                        <img src='https://api.codacy.com/project/badge/grade/8454bc7b66e74cc4be1fa2d8b2a54394'/>
                    </a>
                    <a href='https://travis-ci.org/eirikt/default-webapp-heroku'>
                        <img src='https://travis-ci.org/eirikt/default-webapp-heroku.png'/>
                    </a>
                    <a href='https://www.versioneye.com/user/projects/55f51d813ed894001e000376'>
                        <img src='https://www.versioneye.com/user/projects/55f51d813ed894001e000376/badge.svg'/>
                    </a>
                </section>
            </footer>
        );
    }
});

ReactDOM.render(
    <article className='page'>
        <AppCacheUpdateReady enabled={window.appBuildConfiguration === 'production'} upgradeMessage={window.upgradeMessage}/>
        <Header appTitle={window.appTitle}/>
        <MainContentPlaceholder/>
        <Footer
            appBuildConfiguration={window.appBuildConfiguration} appBuildTimestamp={window.appBuildTimestamp} appTitle={window.appTitle} appVersion={window.appVersion}
            eslintErrors={window.eslintErrors} eslintWarnings={window.eslintWarnings} scsslintWarnings={window.scsslintWarnings}/>
    </article>,
    document.getElementById('content')
);
