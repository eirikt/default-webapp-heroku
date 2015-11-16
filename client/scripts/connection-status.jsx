/* global window, console, document, setTimeout */

/* eslint-disable no-console */
/* eslint-disable no-extra-parens */

/* eslint complexity: [1, 1] */
/* eslint newline-after-var: 1 */

import React from 'react';

export default React.createClass({
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
            }, this.props.fadingDuration);
        }
        Array.prototype.forEach.call(document.getElementsByClassName('connected-only'), (connectedOnlyElements) => {
            connectedOnlyElements.classList.remove('fadeout');
            connectedOnlyElements.classList.add('fadein');
            setTimeout(() => {
                connectedOnlyElements.removeAttribute('hidden');
            }, this.props.fadingDuration);
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
            }, this.props.fadingDuration);
        } else {
            el.classList.add('fadein-connection-status-disconnected');
        }
        Array.prototype.forEach.call(document.getElementsByClassName('connected-only'), (connectedOnlyElements) => {
            connectedOnlyElements.classList.remove('fadein');
            connectedOnlyElements.classList.add('fadeout');
            setTimeout(() => {
                connectedOnlyElements.setAttribute('hidden', 'true');
                connectedOnlyElements.classList.remove('fadeout');
            }, this.props.fadingDuration);
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
