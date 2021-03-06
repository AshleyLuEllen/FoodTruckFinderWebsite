import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
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

// eslint-disable-next-line no-unused-vars
const mapStyles = theme => ({
    mapWrapper: {
        height: '100%',
        width: '100%',
        '& > #map': {
            height: '100%',
        },
    },
});

class GoogleMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            centeredOnCurrentPosition: false,
            infoWindowLoaded: false,
        };

        this.mapRef = React.createRef();

        this.markerClickHook = this.markerClickHook.bind(this);
    }

    markerClickHook(marker) {
        if (this.map) {
            this.map.panTo(marker.marker.getPosition());
            this.map.setZoom(16);

            if (this.state.infoWindowLoaded && !this.props.hideInfoWindow) {
                this.infoWindow.setContent(
                    ReactDOMServer.renderToString(
                        <div className="poi-info-window gm-style">{marker.props.children}</div>
                    )
                );
                this.infoWindow.open(this.map, marker.marker);
            }
        }
    }

    attemptMapLoad() {
        if (typeof window !== 'undefined' && !this.state.loaded) {
            if (!document.querySelector('#google-maps')) {
                loadScript(
                    `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&libraries=places`,
                    document.querySelector('head'),
                    'google-maps'
                );
            }
        }

        if (!this.map && window.google && this.mapRef.current) {
            const defaultCenter = {
                lat: 31.5489,
                lng: -97.1131,
            };

            this.map = new window.google.maps.Map(this.mapRef.current, {
                center: defaultCenter,
                zoom: 14,
            });

            this.setState({
                loaded: true,
            });

            if (this.props.withInfoWindow) {
                this.infoWindow = new window.google.maps.InfoWindow({});
                this.setState({
                    infoWindowLoaded: true,
                });
            }
        }
    }

    componentDidMount() {
        this.attemptMapLoad();
    }

    componentDidUpdate(prevProps) {
        this.attemptMapLoad();

        if (prevProps.center !== this.props.center && this.props.center && this.map) {
            this.map.setCenter(this.props.center);

            this.setState({
                centeredOnCurrentPosition: false,
                mapCenter: this.map.getCenter(),
            });
        }

        if (
            !this.props.center &&
            !this.state.centeredOnCurrentPosition &&
            this.props.isGeolocationEnabled &&
            this.map
        ) {
            if (
                prevProps?.coords?.latitude !== this.props?.coords?.latitude ||
                prevProps?.coords?.longitude !== this.props?.coords?.longitude
            ) {
                this.map.setCenter({
                    lat: this.props?.coords?.latitude,
                    lng: this.props?.coords?.longitude,
                });

                this.setState({
                    centeredOnCurrentPosition: true,
                    mapCenter: this.map.getCenter(),
                });
            }
        }
    }

    componentWillUnmount() {}

    render() {
        const { classes } = this.props;

        const childrenWithProps = React.Children.map(this.props.children, child => {
            const props = {
                mapRef: this.map,
                mapLoaded: this.state.loaded,
                mapCenter: this.state.mapCenter,
                markerClickHook: this.markerClickHook,
            };
            if (React.isValidElement(child)) {
                return React.cloneElement(child, props);
            }
            return child;
        });

        return (
            <div className={classes.mapWrapper}>
                <div id="map" ref={this.mapRef}></div>
                <div style={{ display: 'none' }}>{childrenWithProps}</div>
            </div>
        );
    }
}
export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: null,
})(withStyles(mapStyles, { withTheme: true })(GoogleMap));

var circleIcon = {
    path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0',
    fillColor: '#0000FF',
    fillOpacity: 0.6,
    // anchor: new google.maps.Point(0,0),
    strokeWeight: 0,
    scale: 0.3,
};

GoogleMap.propTypes = {
    hideInfoWindow: PropTypes.bool,
    withInfoWindow: PropTypes.bool,
    center: PropTypes.exact({
        lat: PropTypes.any.isRequired,
        lng: PropTypes.any.isRequired,
    }),
    children: PropTypes.any,
    coords: PropTypes.any,
    isGeolocationEnabled: PropTypes.any,
    classes: PropTypes.any,
};

export class Marker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            attached: false,
        };

        this.marker = null;
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler(event) {
        this.props.onClick && this.props.onClick(event, this);
        if (!this.props.preventDefaultOnClick && !this.props.disableInfoWindow) {
            this.props.markerClickHook(this);
        }
    }

    addToMap() {
        const animationType = this.props.animation === 'drop' ? window.google.maps.Animation.DROP : undefined;

        let icon = undefined;

        if (this.props.variant === 'circle') {
            icon = circleIcon;
        }

        this.marker = new window.google.maps.Marker({
            draggable: this.props.draggable || false,
            animation: animationType,
            position: this.props.position || this.props.mapRef.getCenter(),
            label: this.props.label,
            title: this.props.title,
            icon,
        });

        this.marker.setMap(this.props.mapRef);

        window.google.maps.event.addListener(this.marker, 'click', this.clickHandler);

        this.setState({
            attached: true,
        });
    }

    componentDidMount() {
        if (this.props.mapRef && !this.state.attached) {
            this.addToMap();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.mapRef && !this.state.attached) {
            this.addToMap();
        }

        if (
            this.marker &&
            (prevProps.position !== this.props.position || prevProps.mapCenter !== this.props.mapCenter)
        ) {
            if (this.props.position) {
                this.marker.setPosition(this.props.position);
            } else {
                this.marker.setPosition(this.props.mapRef.getCenter());
            }
        }
    }

    componentWillUnmount() {
        if (!this.state.attached || !this.marker) {
            return;
        }

        this.marker.setMap(null);
        this.marker = null;
    }

    render() {
        return <div className="marker">{this.props.mapRef ? 'Map found' : 'Map not found'}</div>;
    }
}

Marker.propTypes = {
    onClick: PropTypes.func,
    preventDefaultOnClick: PropTypes.bool,
    disableInfoWindow: PropTypes.bool,
    markerClickHook: PropTypes.func,
    animation: PropTypes.oneOf(['drop', 'none']),
    variant: PropTypes.oneOf(['circle', 'default']),
    draggable: PropTypes.bool,
    position: PropTypes.exact({
        lat: PropTypes.any,
        lng: PropTypes.any,
    }),
    label: PropTypes.string,
    title: PropTypes.string,
    mapRef: PropTypes.any,
    mapCenter: PropTypes.exact({
        lat: PropTypes.any,
        lng: PropTypes.any,
    }),
};
