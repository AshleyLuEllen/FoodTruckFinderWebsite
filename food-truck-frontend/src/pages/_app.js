/* eslint-disable react/prop-types */
import React from 'react';
import { Provider } from 'react-redux';
import { buildStore } from '../redux/redux';
import { PersistGate } from 'redux-persist/integration/react';

import Head from 'next/head';
import { CssBaseline } from '@material-ui/core';
import { FoodTruckThemeProvider } from '../util/theme';

import DefaultLayout from '../components/Layout';
import './styles.css';

let initialState = {};
let { store, persistor } = buildStore(initialState);

const FoodTruckApp = ({ Component, pageProps }) => {
    const Layout = Component.Layout || DefaultLayout;

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Head>
                    <base />
                    <title>Food Truck Finder</title>
                    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                    />
                </Head>

                <FoodTruckThemeProvider>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />

                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </FoodTruckThemeProvider>
            </PersistGate>
        </Provider>
    );
};

export default FoodTruckApp;
