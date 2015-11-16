/* global window, document */

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
import ConnectionStatus from './connection-status.jsx';
import ConnectionCount from './connection-count.jsx';

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

const StatusContainer = React.createClass({
    render: function() {
        return (
            <section className='status-container'>
                <section>
                    <section className='network-status-container'></section>
                    <section className='connection-status-container'>
                        <ConnectionCount fadingDuration={fadingDuration}/>
                    </section>
                </section>
                <section>
                    <section className='network-status-container'>
                        <NetworkStatus fadingDuration={fadingDuration}/>
                    </section>
                    <section className='connection-status-container'>
                        <ConnectionStatus fadingDuration={fadingDuration}/>
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
