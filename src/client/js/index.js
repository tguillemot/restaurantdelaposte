/* globals document window */

import React from 'react';
import {render} from 'react-dom';
import FastClick from 'fastclick';
//import injectTapEventPlugin from 'react-tap-event-plugin';
import {hydrate} from 'emotion';

import ReactHotLoader from './ReactHotLoader';
import Root from './app/Root';
import history from './app/history';
import configureStore from '../../common/configureStore';
import '../css/index.scss';

/** ******************
 *  Server hydration
 ******************* */
if (window.EMOTION_IDS) {
    hydrate(window.EMOTION_IDS);
}

// Remove the server-side injected CSS.
const jssStyles = document.getElementById('jss-server-side');
if (jssStyles && jssStyles.parentNode) {
    jssStyles.parentNode.removeChild(jssStyles);
}
const {store} = configureStore(history, window.REDUX_STATE);

FastClick.attach(document.body);
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
//injectTapEventPlugin();

const root = document.getElementById('root');

const renderApp = (RootElement) => {
    const app = (<ReactHotLoader>
        <RootElement {...{store}} />
    </ReactHotLoader>);

    render(app, root);
};

if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./app/Root/index', () => {
        const app = require('./app/Root/index').default;
        renderApp(app);
    });
}

renderApp(Root);
