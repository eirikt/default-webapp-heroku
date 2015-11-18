/* global window, document */

/* eslint-disable no-console */
/* eslint-disable no-mixed-requires */
/* eslint-disable no-alert */

/* eslint complexity: [1, 1] */
/* eslint newline-after-var: 1 */
/* eslint no-warning-comments: 1 */

import React from 'react';
import ReactDOM from 'react-dom';

import AppCacheUpdateReady from './appcache-updateready.jsx';

import Title from './title.jsx';
import NetworkStatus from './network-status.jsx';
import ConnectionStatus from './connection-status.jsx';
import ConnectionCount from './connection-count.jsx';

const fadingDuration = 1000;


const Header = ({ appTitle }) => (
    <header>
        <section>
            <Title title={appTitle}/>
            <StatusContainer/>
        </section>
        <hr/>
    </header>
);

const StatusContainer = () => (
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


const MainContentPlaceholder = () => (
    <section className='watermark'>some content ...</section>
);


const Footer = ({ appTitle, appVersion, appBuildTimestamp, appBuildConfiguration, scsslintWarnings, eslintErrors, eslintWarnings }) => (
    <footer>
        <hr/>
        <section>
            <span>{appTitle} v{appVersion}</span>
            <span>built {appBuildTimestamp}</span>
            <DevelopmentLabel buildConfiguration={appBuildConfiguration}/>
        </section>
        <section>
            <section>
                <BadgeWithPill name={'JS errors'} type={'error'} pillText={eslintErrors}/>
                <span>&nbsp;</span>
                <BadgeWithPill name={'JS warnings'} type={'warning'} pillText={eslintWarnings}/>
            </section>
            <section>
                <BadgeWithPill name={'CSS warnings'} type={'warning'} pillText={scsslintWarnings}/>
            </section>
        </section>
        <section>
            <CodacyBadge/>
            <TravisBadge/>
            <VersionEyeBadge/>
        </section>
    </footer>
);

// TODO: Simplify
const DevelopmentLabel = React.createClass({
    render: function() {
        if (this.props.buildConfiguration === 'development') {
            return (
                <span className='development'>Development configuration</span>
            );
        }
        return false;
    }
});

const BadgeWithPill = ({ name, type, pillText }) => (
    <span className={type + '-badge'}>
        <span>{name}</span>
        <span className='pill'>{pillText}</span>
    </span>
);

const CodacyBadge = () => (
    <a href='https://www.codacy.com/app/eiriktorske/default-webapp-heroku'>
        <img src='https://api.codacy.com/project/badge/grade/8454bc7b66e74cc4be1fa2d8b2a54394'/>
    </a>
);

const TravisBadge = () => (
    <a href='https://travis-ci.org/eirikt/default-webapp-heroku'>
        <img src='https://travis-ci.org/eirikt/default-webapp-heroku.png'/>
    </a>
);

const VersionEyeBadge = () => (
    <a href='https://www.versioneye.com/user/projects/55f51d813ed894001e000376'>
        <img src='https://www.versioneye.com/user/projects/55f51d813ed894001e000376/badge.svg'/>
    </a>
);

// Fork me on GitHub (https://github.com/blog/273-github-ribbons)
/* eslint max-len: 1 */
const ForkMeOnGitHubBanner = () => (
    <a href='//github.com/eirikt/default-webapp-heroku'>
        <img className='banner' src='//camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67' alt='Fork me on GitHub' data-canonical-src='//s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png'/>
    </a>
);

const Page = () => (
    <article className='page'>
        <Header appTitle={window.appTitle}/>
        <MainContentPlaceholder/>
        <Footer
            appBuildConfiguration={window.appBuildConfiguration}
            appBuildTimestamp={window.appBuildTimestamp}
            appTitle={window.appTitle}
            appVersion={window.appVersion}
            eslintErrors={window.eslintErrors}
            eslintWarnings={window.eslintWarnings}
            scsslintWarnings={window.scsslintWarnings}/>
    </article>
);

ReactDOM.render(
    <div>
        <AppCacheUpdateReady enabled={window.appBuildConfiguration === 'production'} upgradeMessage={window.upgradeMessage}/>
        <ForkMeOnGitHubBanner/>
        <Page/>
    </div>,
    document.getElementById('content')
);
