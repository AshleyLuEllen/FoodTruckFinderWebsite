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
        height: '100%',
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
        }

        if (!this.map && window.google && this.mapRef.current) {
            const defaultCenter = {
                lat: 31.5489,
                lng: -97.1131
            };

            this.map = new window.google.maps.Map(this.mapRef.current, {
                center: defaultCenter,
                zoom: 14
            });

            this.setState({
                loaded: true
            });
        }
    }

    componentDidMount() {
        this.attemptMapLoad();
    }

    componentDidUpdate(prevProps) {
        this.attemptMapLoad();

        if (prevProps.center !== this.props.center && this.props.center) {
            this.map.setCenter(this.props.center);

            this.setState({
                centeredOnCurrentPosition: false,
                mapCenter: this.map.getCenter()
            });
        }

        if (!this.props.center && !this.state.centeredOnCurrentPosition && this.props.isGeolocationEnabled) {
            if (prevProps?.coords?.latitude !== this.props?.coords?.latitude || prevProps?.coords?.longitude !== this.props?.coords?.longitude) {
                this.map.setCenter({
                    lat: this.props?.coords?.latitude,
                    lng: this.props?.coords?.longitude
                });

                this.setState({
                    centeredOnCurrentPosition: true,
                    mapCenter: this.map.getCenter()
                });
            }
        }
    }

    componentWillUnmount() {
    }

    render() {
        const { classes } = this.props;

        const childrenWithProps = React.Children.map(this.props.children, child => {
            const props = { mapRef: this.map, mapLoaded: this.state.loaded, mapCenter: this.state.mapCenter };
            if (React.isValidElement(child)) {
                return React.cloneElement(child, props);
            }
            return child;
        });

        return <div className={classes.mapWrapper}>
            <div id="map" ref={this.mapRef}></div>
            <div style={{ display: 'none' }}>{childrenWithProps}</div>
        </div>
    }
}
export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: null,
})(withStyles(mapStyles, { withTheme: true })(GoogleMap));

var circleIcon = {
    path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
    fillColor: '#0000FF',
    fillOpacity: .6,
    // anchor: new google.maps.Point(0,0),
    strokeWeight: 0,
    scale: 0.3
}

export class Marker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            attached: false
        };

        this.marker = null;
    }

    addToMap() {
        const animationType = this.props.animation === 'drop' ? google.maps.Animation.DROP : undefined;

        let icon = undefined;

        if (this.props.variant === 'circle') {
            icon = circleIcon;
        }

        this.marker = new google.maps.Marker({
            draggable: this.props.draggable || false,
            animation: animationType,
            position: this.props.position || this.props.mapRef.getCenter(),
            label: this.props.label,
            title: this.props.title,
            icon,
        });

        this.marker.setMap(this.props.mapRef);

        this.setState({
            attached: true
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

        if (prevProps.position !== this.props.position || prevProps.mapCenter !== this.props.mapCenter) {
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
        return <div className="marker">
            {this.props.mapRef ? "Map found" : "Map not found"}
        </div>
    }
}