import React, { Component } from 'react';

import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    tooltipHeader: {
        fontWeight: "bold"
    },
    tooltipDesc: {
    }
});

export class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMarker: {},
            selectedPlace: {},
            showingInfoWindow: false
        };
    }

    mapListItemIdToMarker = []

    onMarkerClick = (props, marker) =>
        this.setState({
            activeMarker: marker,
            selectedPlace: props,
            showingInfoWindow: true
        });

    onInfoWindowClose = () =>
        this.setState({
            activeMarker: null,
            showingInfoWindow: false
        });

    onMapClicked = () => {
        if (this.state.showingInfoWindow) {
            this.setState({
                activeMarker: null,
                showingInfoWindow: false
            });
        }
    };

    componentDidUpdate(prevProps) {
        if (this.props.selected != prevProps.selected) {
            if (this.props.selected !== undefined) {
                this.onMarkerClick(this.mapListItemIdToMarker)
                this.onMarkerClick(this.refs[`marker${this.props.selected}`].props, this.refs[`marker${this.props.selected}`].marker);
            }
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <Map
                centerAroundCurrentLocation
                google={this.props.google}
                onClick={this.onMapClicked}
                containerStyle={this.props.containerStyle}
                zoom={14}>

                {this.props.trucks.map((tr, i) => (
                    <Marker
                        key={i}
                        ref={`marker${i}`}
                        onClick={this.onMarkerClick}
                        name={tr.name}
                        title={tr.description}
                        position={tr.location}
                    />
                ))}

                <InfoWindow
                    marker={this.state.activeMarker}
                    onClose={this.onInfoWindowClose}
                    visible={this.state.showingInfoWindow}>
                    <div>
                        <div className={classes.tooltipHeader}>{this.state.selectedPlace.name}</div>
                        {this.state.selectedPlace.title && <div className={classes.tooltipDesc}>{this.state.selectedPlace.title}</div>}
                    </div>
                </InfoWindow>
            </Map>
        );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.GOOGLE_MAPS_API_KEY
})(withStyles(styles, { withTheme: true })(MapContainer));