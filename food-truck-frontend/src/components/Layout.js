// components/Layout.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import Header from './Header';

export default class Layout extends Component {
    render() {
        const { children } = this.props;
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <div className="layout">
                    <Header />
                    {children}
                </div>
            </MuiPickersUtilsProvider>
        );
    }
}

Layout.propTypes = {
    children: PropTypes.any,
};
