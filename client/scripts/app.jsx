var React = require('react'),
    ReactDOM = require('react-dom'),

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

    AppCacheUpdateReady = React.createClass({
        render: function() {
            console.log('React :: AppCacheUpdateReady component: rendering ...');
            return false;
        },
        componentDidMount: function() {
            console.log('React :: AppCacheUpdateReady component: mounted ... (enabled=' + this.props.enabled + ', upgradeMessage=' + this.props.upgradeMessage + ')');
            var appCache = window.applicationCache,
                upgradeMessage = this.props.upgradeMessage;
            if (appCache) {
                appCache.addEventListener('updateready', function() {
                    if (appCache.status === appCache.UPDATEREADY) {
                        if (window.confirm(upgradeMessage)) {
                            window.location.reload();
                        }
                    }
                }, false);
            }
        }
    }),

    Title = React.createClass({
        render: function() {
            return (
                <section className='title'>{this.props.appTitle}</section>
            );
        }
    }),

    NetworkStatus = React.createClass({
        updateNetworkStatus: function(event) {
            var online = navigator.onLine,
                condition = online ? 'online' : 'offline';

            console.log('React :: NetworkStatus component: Event:' + (!event ? 'unknown' : event.type) + ', Status:' + condition);

            var el = this.refs.networkStatus;
            el.classList.remove('fadein-network-status-offline');
            el.classList.remove('fadeout-network-status-offline');
            el.classList.remove('fadein-network-status-online');
            el.classList.remove('fadeout-network-status-online');

            if (online) {
                if (event != null) {
                    el.classList.add('fadeout-network-status-offline');
                }
                setTimeout(function() {
                    if (event != null) {
                        el.classList.remove('fadeout-network-status-offline');
                    }
                    el.classList.add('fadein-network-status-online');
                }, 1000);

            } else {
                if (event != null) {
                    el.classList.add('fadeout-network-status-online');
                }
                setTimeout(function() {
                    if (event != null) {
                        el.classList.remove('fadeout-network-status-online');
                    }
                    el.classList.add('fadein-network-status-offline');
                }, 1000);
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
            window.removeEventListener('online', function() {
                console.log('React :: ConnectionStatus component: \'online\' event listener removed ...');
            }, false);
            window.removeEventListener('offline', function() {
                console.log('React :: ConnectionStatus component: \'offline\' event listener removed ...');
            }, false);
        }
    }),

    ConnectionStatus = React.createClass({
        removeAllFadingClasses: function(el) {
            el.classList.remove('fadein-connection-status-disconnected');
            el.classList.remove('fadeout-connection-status-disconnected');
            el.classList.remove('fadein-connection-status-connected');
            el.classList.remove('fadeout-connection-status-connected');
        },
        fadeinConnection: function() {
            var el = this.refs.connectionStatus;
            this.removeAllFadingClasses(el);
            if (window.connected === false) {
                el.classList.add('fadeout-connection-status-disconnected');
                setTimeout(function() {
                    el.classList.remove('fadeout-connection-status-disconnected');
                    el.classList.add('fadein-connection-status-connected');
                }, 1000);
            } else {
                el.classList.add('fadein-connection-status-connected');
            }
            Array.prototype.forEach.call(document.getElementsByClassName('connected'), function(el) {
                el.classList.remove('fadeout');
                el.classList.add('fadein');
                setTimeout(function() {
                    el.removeAttribute('hidden');
                }, 1000);
            });
        },
        fadeoutConnection: function() {
            var el = this.refs.connectionStatus;
            this.removeAllFadingClasses(el);
            if (window.connected === true) {
                el.classList.add('fadeout-connection-status-connected');
                setTimeout(function() {
                    el.classList.remove('fadeout-connection-status-connected');
                    el.classList.add('fadein-connection-status-disconnected');
                }, 1000);
            } else {
                el.classList.add('fadein-connection-status-disconnected');
            }
            Array.prototype.forEach.call(document.getElementsByClassName('connected'), function(el) {
                el.classList.remove('fadein');
                el.classList.add('fadeout');
                setTimeout(function() {
                    el.setAttribute('hidden', 'true');
                    el.classList.remove('fadeout');
                }, 1000);
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
            window.removeEventListener('connected', function() {
                console.log('React :: ConnectionStatus component: \'connected\' event listener removed ...');
            }, false);
            window.removeEventListener('disconnected', function() {
                console.log('React :: ConnectionStatus component: \'disconnected\' event listener removed ...');
            }, false);
            window.removeEventListener('connection-failed', function() {
                console.log('React :: ConnectionStatus component: \'connection-failed\' event listener removed ...');
            }, false);
            window.removeEventListener('connection-error', function() {
                console.log('React :: ConnectionStatus component: \'connection-error\' event listener removed ...');
            }, false);
        }
    }),

    ConnectionCount = React.createClass({
        render: function() {
            console.log('React :: ConnectionCount component: rendering ...');
            return (
                <span className='connected connection-count' ref='connectionCount'></span>
            );
        },
        componentDidMount: function() {
            console.log('React :: ConnectionCount component: mounted ...');
            var el = this.refs.connectionCount;
            window.addEventListener('connection-count', function(event) {
                console.log('React :: ConnectionCount component: CONNECTIONCOUNT received ... (' + JSON.stringify(event.detail) + ')');
                el.classList.add('fadein');
                if (window.connectionCount === 1) {
                    el.innerText = 'You\'re the only user connected ...';
                } else {
                    el.innerText = window.connectionCount + ' active connections';
                }
                el.classList.remove('fadeout');
            }, false);
        }
    }),

    StatusContainer = React.createClass({
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
    }),

    Header = React.createClass({
        render: function() {
            return (
                <header>
                    <section>
                        <Title appTitle={this.props.appTitle}/>
                        <StatusContainer/>
                    </section>
                    <hr/>
                </header>
            );
        }
    }),

    MainContentPlaceholder = React.createClass({
        render: function() {
            return (
                <section className='watermark'>some content ...</section>
            );
        }
    }),

    ApplicationLabel = React.createClass({
        render: function() {
            return (
                <span>{this.props.appTitle}&nbsp;v{this.props.appVersion}</span>
            );
        }
    }),

    ApplicationBuiltLabel = React.createClass({
        render: function() {
            return (
                <span>built&nbsp;{this.props.appBuildTimestamp}</span>
            );
        }
    }),

    DevelopmentLabel = React.createClass({
        render: function() {
            if (this.props.appBuildConfiguration === 'development') {
                return (
                    <span className='development'>Development configuration</span>
                );
            }
            return false;
        }
    }),

    Footer = React.createClass({
        render: function() {
            return (
                <footer>
                    <hr/>
                    <section>
                        <ApplicationLabel appTitle={this.props.appTitle} appVersion={this.props.appVersion}/>
                        <ApplicationBuiltLabel appBuildTimestamp={this.props.appBuildTimestamp}/>
                        <DevelopmentLabel appBuildConfiguration={this.props.appBuildConfiguration}/>
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
        <Footer appBuildConfiguration={window.appBuildConfiguration} appBuildTimestamp={window.appBuildTimestamp} appTitle={window.appTitle} appVersion={window.appVersion}/>
    </article>,
    document.getElementById('content')
);
