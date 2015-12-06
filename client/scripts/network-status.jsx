/* global window, console, navigator, setTimeout */

/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-extra-parens */
/* eslint-disable no-unused-vars */

/* eslint complexity: [1, 1] */
/* eslint newline-after-var: 1 */

import React from 'react';

export default React.createClass({
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
            }, this.props.fadingDuration);

        } else {
            if (event) {
                el.classList.add('fadeout-network-status-online');
            }
            setTimeout(() => {
                if (event) {
                    el.classList.remove('fadeout-network-status-online');
                }
                el.classList.add('fadein-network-status-offline');
            }, this.props.fadingDuration);
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
