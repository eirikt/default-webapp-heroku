/* global window, console, setTimeout */

/* eslint-disable no-console */
/* eslint-disable no-extra-parens */

/* eslint complexity: [1, 1] */
/* eslint newline-after-var: 1 */

import React from 'react';

export default React.createClass({
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
            }, this.props.fadingDuration);
        }, false);
    },

    componentWillUnmount: function() {
        console.log('React :: ConnectionCount component: unmounted ...');
        window.removeEventListener('connection-count', () => {
            console.log('React :: ConnectionCount component: \'connection-count\' event listener removed ...');
        }, false);
    }
});
