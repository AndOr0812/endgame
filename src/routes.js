import _ from 'lodash';

import utils from './utils';

export default {
    parseGameId() {
        return _.last(utils.pathParts(window.location.pathname)) ||
            window.location.hash.substring(1);
    },

    genGameUrl(gameId) {
        let url = window.location.protocol + '//' + window.location.hostname +
            (window.location.port ? ':' + window.location.port : '');

        let hash = this.isDevMode() ? '#' : '';

        return `${url}/${hash}${gameId}`;
    },

    isDevMode() {
        return window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1';
    },

    isDebugMode() {
        if (!this._isDebugMode) {
            const parts = utils.queryStringParts(window.location.search);
            this._isDebugMode = parts['debug'] === 'true';
        }
        return this._isDebugMode;
    }
};
