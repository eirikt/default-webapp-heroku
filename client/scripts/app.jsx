/* global require, window, navigator, document, console, setTimeout */

/* eslint-disable no-console */
/* eslint-disable no-mixed-requires */
/* eslint-disable no-alert */

/* eslint complexity: [1, 1] */
/* eslint newline-after-var: 1 */

const React = require('react');
const ReactDOM = require('react-dom');
const Title = require('./title.jsx');

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

const AppCacheUpdateReady = React.createClass({
    render: function() {
        console.log('React :: AppCacheUpdateReady component: rendering ...');
        return false;
    },
    componentDidMount: function() {
        const appCache = window.applicationCache;
        const upgradeMessage = this.props.upgradeMessage;

        console.log('React :: AppCacheUpdateReady component: mounted ... (enabled=' + this.props.enabled + ', upgradeMessage=' + this.props.upgradeMessage + ')');

        if (appCache) {
            appCache.addEventListener('updateready', () => {
                if (appCache.status === appCache.UPDATEREADY) {
                    if (window.confirm(upgradeMessage)) {
                        window.location.reload();
                    }
                }
            }, false);
        }
    }
});

const NetworkStatus = React.createClass({
    updateNetworkStatus: function(event) {
        const online = navigator.onLine;
        const condition = online ? 'online' : 'offline';
        const el = this.refs.networkStatus;

        console.log('React :: NetworkStatus component: Event:' + (event ? event.type : 'unknown') + ', Status:' + condition);

        el.classList.remove('fadein-network-status-offline');
        el.classList.remove('fadeout-network-status-offline');
        el.classList.remove('fadein-network-status-online');
        el.classList.remove('fadeout-network-status-online');

        if (online) {
            if (event) {
                el.classList.add('fadeout-network-status-offline');
            }
            setTimeout(() => {
                if (event) {
                    el.classList.remove('fadeout-network-status-offline');
                }
                el.classList.add('fadein-network-status-online');
            }, fadingDuration);

        } else {
            if (event) {
                el.classList.add('fadeout-network-status-online');
            }
            setTimeout(() => {
                if (event) {
                    el.classList.remove('fadeout-network-status-online');
                }
                el.classList.add('fadein-network-status-offline');
            }, fadingDuration);
        }
    },
    render: function() {
        console.log('React :: NetworkStatus component: rendering ...');
        return (
            <span ref='networkStatus'></span>
        );
    },
    componentDidMount: function() {
        console.log('React :: NetworkStatus component: mounted ...');
        window.addEventListener('online', this.updateNetworkStatus, false);
        window.addEventListener('offline', this.updateNetworkStatus, false);
        this.updateNetworkStatus();
    },
    componentWillUnmount: function() {
        console.log('React :: NetworkStatus component: unmounted ...');
        window.removeEventListener('online', () => {
            console.log('React :: ConnectionStatus component: \'online\' event listener removed ...');
        }, false);
        window.removeEventListener('offline', () => {
            console.log('React :: ConnectionStatus component: \'offline\' event listener removed ...');
        }, false);
    }
});

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
        if (window.connected === false) {
            el.classList.add('fadeout-connection-status-disconnected');
            setTimeout(() => {
                el.classList.remove('fadeout-connection-status-disconnected');
                el.classList.add('fadein-connection-status-connected');
            }, fadingDuration);
        } else {
            el.classList.add('fadein-connection-status-connected');
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
        if (window.connected === true) {
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
            const connectionCount = event.detail['connection-count'];
            console.log('React :: ConnectionCount component: CONNECTIONCOUNT received ... (' + JSON.stringify(event.detail) + ')');
            el.classList.remove('fadein');
            el.classList.add('fadeout');
            setTimeout(() => {
                if (connectionCount === 1) {
                    el.innerText = 'You\'re the only user connected ...';
                } else {
                    el.innerText = connectionCount + ' active connections';
                }
                el.classList.remove('fadeout');
                el.classList.add('fadein');
            }, fadingDuration);
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
                        <NetworkStatus/>
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
        <Footer appBuildConfiguration={window.appBuildConfiguration} appBuildTimestamp={window.appBuildTimestamp} appTitle={window.appTitle} appVersion={window.appVersion} eslintErrors={window.eslintErrors} eslintWarnings={window.eslintWarnings}/>
    </article>,
    document.getElementById('content')
);
