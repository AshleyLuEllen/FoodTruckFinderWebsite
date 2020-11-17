import React, { Component } from 'react';
import { geolocated } from 'react-geolocated';

import { withStyles } from '@material-ui/core/styles';

function loadScript(src, position, id) {
    if (!position) {
        return;
    }

    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('id', id);
    script.src = src;
    position.appendChild(script);
}

const mapStyles = (theme) => ({
    mapWrapper: {
        height: '500px',
        width: '100%',
        '& > #map': {
            height: '100%'
        }
    },
});

class GoogleMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            map: undefined,
            loaded: false,
            centeredOnCurrentPosition: false
        };

        this.mapRef = React.createRef();
    }

    attemptMapLoad() {
        if (typeof window !== 'undefined' && !this.state.loaded) {
            if (!document.querySelector('#google-maps')) {
                loadScript(
                    'https://maps.googleapis.com/maps/api/js?key=AIzaSyDSDFlqV9UDWh6V0D6STb7JU0-niCSb91U&libraries=places',
                    document.querySelector('head'),
                    'google-maps',
                );
            }

            this.setState({
                loaded: true
            });
        }

        if (!this.state.map && window.google && this.mapRef.current) {
            const defaultCenter = {
                lat: 31.5489,
                lng: -97.1131
            };

            this.map = new window.google.maps.Map(this.mapRef.current, {
                center: defaultCenter,
                zoom: 14
            });
        }
    }

    componentDidMount() {
        this.attemptMapLoad();
    }

    componentDidUpdate(prevProps) {
        this.attemptMapLoad();

        if (!this.state.centeredOnCurrentPosition && this.props.isGeolocationEnabled) {
            if (prevProps?.coords?.latitude !== this.props?.coords?.latitude || prevProps?.coords?.longitude !== this.props?.coords?.longitude) {
                this.map.setCenter({
                    lat: this.props?.coords?.latitude,
                    lng: this.props?.coords?.longitude
                });
            }
        }
    }

    componentWillUnmount() {
    }

    render() {
        const { classes } = this.props;

        return <div className={classes.mapWrapper}>
            <div id="map" ref={this.mapRef}></div>
        </div>
    }
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: null,
})(withStyles(mapStyles, { withTheme: true })(GoogleMap));