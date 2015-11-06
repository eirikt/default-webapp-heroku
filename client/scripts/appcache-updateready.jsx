/* global window, console */

/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

/* eslint complexity: [1, 1] */
/* eslint newline-after-var: 1 */

import React from 'react';

export default React.createClass({
    render: function() {
        console.log('React :: AppCacheUpdateReady component: rendering (No DOM elements ...');
        return false;
    },
    componentDidMount: function() {
        const upgradeMessage = this.props.upgradeMessage;
        console.log('React :: AppCacheUpdateReady component: mounted ... (enabled=' + this.props.enabled + ', upgradeMessage=' + this.props.upgradeMessage + ')');
        if (window.applicationCache) {
            window.applicationCache.addEventListener('updateready', () => {
                if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
                    if (window.confirm(upgradeMessage)) {
                        window.location.reload();
                    }
                }
            }, false);
        }
    }
});
