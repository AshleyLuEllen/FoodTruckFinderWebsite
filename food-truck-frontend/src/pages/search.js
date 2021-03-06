import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import requests from '../util/requests';
import clsx from 'clsx';
import { geolocated } from 'react-geolocated';
import { useRouter } from 'next/router';
import Link from 'next/link';

import {
    Container,
    Grid,
    Typography,
    TextField,
    Button,
    Paper,
    Box,
    CircularProgress,
    Snackbar,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Rating, Alert } from '@material-ui/lab';
import ChipSelector from '../components/ChipSelector';
import TruckCard from '../components/TruckCard';
import LocationInput from '../components/LocationInput';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import GoogleMap, { Marker } from '../components/GoogleMap';
import Head from 'next/dist/next-server/lib/head';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: '20px',
    },
    queryField: {
        width: '100%',
        marginBottom: '10px',
    },
    mapWrapper: {
        position: 'relative',
        width: '100%',
        height: '87vh',
    },
    truckCard: {
        marginBottom: '5px',
    },
    searchButton: {
        height: 'auto',
        width: '50%',
        display: 'block',
        margin: '0 auto',
        marginBottom: '10px',
    },
    ratingContainer: {
        display: 'flex',
        height: '50px',
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonProgress: {
        //   color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    resultsPage: {
        top: 0,
        left: '-200%',
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 10,
        transition: '0.5s all',
        paddingLeft: '15px',
        paddingRight: '15px',
        backgroundColor: '#3f51b5',
        color: 'white',
    },
    resultsVisible: {
        left: 0,
    },
}));

function SearchPage(props) {
    const classes = useStyles();
    const router = useRouter();

    const [tagOptions, setTagOptions] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [, setCurrentlySelected] = useState(undefined);
    const [showingResults, setShowingResults] = useState(false);
    const [preferredRating, setPreferredRating] = useState(null);
    const [location, setLocation] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [truckResults, setTruckResults] = useState([]);
    const [userId, setUserId] = useState(undefined);

    const [errorMsg, setErrorMsg] = useState('');
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorSeverity, setErrorSeverity] = useState('error');

    useEffect(() => {
        setUserId(props.auth.userId);

        requests
            .get(`${process.env.FOOD_TRUCK_API_URL}/tags`)
            .then(res => {
                setTagOptions(res.data);
            })
            .catch(err => {
                console.error(err);
                setErrorMsg('Error: could not fetch tags! Check console for more information.');
                setErrorOpen(true);
            });
    }, []);

    useEffect(() => {
        if (router.query.query) {
            setSearchQuery(router.query.query);
        }
    }, [router.query.query]);

    useEffect(() => {
        if (router.query.tag && tagOptions) {
            let newSelection = [];
            const selectedTag = tagOptions.find(t => t.name === router.query.tag);
            if (selectedTag) newSelection.push(selectedTag);
            setSelectedTags(newSelection);
        }
    }, [router.query.tag, tagOptions]);

    useEffect(() => {
        if (props.coords?.latitude && props.coords?.longitude && userId) {
            const position = {
                latitude: props?.coords?.latitude,
                longitude: props?.coords?.longitude,
            };

            requests
                .putWithAuth(`${process.env.FOOD_TRUCK_API_URL}/users/me/location`, position, props.auth)
                .then(() => {
                    console.log('position updated');
                })
                .catch(err => {
                    console.error(err);
                    setErrorMsg('Error: could not update user position! Try again later.');
                    setErrorOpen(true);
                });
        }
    }, [props.coords?.latitude, props.coords?.longitude]);

    const resultsPageClass = clsx({
        [classes.resultsVisible]: showingResults,
    });

    const handleButtonClick = () => {
        if (!loading) {
            if (!location) {
                if (!props.isGeolocationAvailable || !props.isGeolocationEnabled) {
                    setErrorMsg('Error: location services is not available! Try again later.');
                    setErrorOpen(true);
                } else {
                    setShowingResults(false);
                    setLoading(true);
                    const queryObj = {
                        query: searchQuery,
                        tags: selectedTags,
                        location: {
                            latitude: props.coords?.latitude || 31.5489,
                            longitude: props.coords?.longitude || -97.1131,
                        },
                        preferredRating,
                    };
                    requests
                        .post(`${process.env.FOOD_TRUCK_API_URL}/search`, queryObj)
                        .then(res => {
                            setTruckResults(res.data);
                            // setCurrentlySelected(0);
                            setShowingResults(true);
                            setLoading(false);
                        })
                        .catch(err => {
                            console.error(err);
                            setErrorMsg('Error: could not search! Try again later.');
                            setErrorOpen(true);
                        });
                }
            } else {
                setShowingResults(false);
                setLoading(true);
                const queryObj = {
                    query: searchQuery,
                    tags: selectedTags,
                    placeId: location,
                    preferredRating,
                };
                requests
                    .post(`${process.env.FOOD_TRUCK_API_URL}/search`, queryObj)
                    .then(res => {
                        setTruckResults(res.data);
                        // setCurrentlySelected(0);
                        setShowingResults(true);
                        setLoading(false);
                    })
                    .catch(err => {
                        console.error(err);
                        setErrorMsg('Error: could not search! Try again later.');
                        setErrorOpen(true);
                    });
            }
        }
    };

    let markerCount = 0;

    return (
        <Container className={classes.root}>
            <Head>
                <title>Search</title>
            </Head>
            <Grid container spacing={3}>
                <Grid item xs={12} md={5} style={{ position: 'relative' }}>
                    <Typography variant="h4" style={{ marginBottom: '10px', textAlign: 'center' }}>
                        Search
                    </Typography>
                    <TextField
                        className={classes.queryField}
                        label="Name or Description"
                        variant="outlined"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onBlur={() => setSearchQuery(searchQuery.trim())}
                    />
                    <div className={classes.queryField}>
                        <ChipSelector
                            label="Tags"
                            options={tagOptions}
                            selectedOptions={selectedTags}
                            onChange={(event, value) => setSelectedTags(value)}
                        />
                    </div>
                    <LocationInput
                        onChange={(event, value) => {
                            console.log(value);
                            setLocation(value?.place_id);
                        }}
                    />
                    <div className={classes.ratingContainer}>
                        <Typography variant="h6" style={{ marginRight: '20px' }}>
                            Minimum Rating
                        </Typography>
                        <Rating
                            name="preferredRating"
                            precision={0.5}
                            value={preferredRating}
                            onChange={(event, newValue) => {
                                setPreferredRating(newValue);
                            }}
                            size="large"
                        />
                    </div>
                    <div className={classes.wrapper}>
                        <Button
                            className={`${classes.searchButton}`}
                            onClick={handleButtonClick}
                            disabled={loading}
                            variant="contained"
                            color="primary"
                        >
                            Search!
                        </Button>
                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                    <Paper className={`${classes.resultsPage} ${resultsPageClass}`} elevation={3}>
                        <Button
                            // color="primary"
                            style={{ width: 'auto', height: 'auto', textAlign: 'center', color: 'white' }}
                            onClick={() => setShowingResults(false)}
                        >
                            <ArrowBackIosIcon /> Back to Search
                        </Button>
                        <Typography
                            variant="h4"
                            style={{ marginTop: '10px', marginBottom: '10px', textAlign: 'center' }}
                        >
                            Search Results
                        </Typography>
                        <Box style={{ textAlign: 'left', maxHeight: 'calc(75vh)', overflow: 'auto' }}>
                            {truckResults.map((tr, i) => (
                                <TruckCard
                                    key={i}
                                    className={classes.truckCard}
                                    userId={userId}
                                    tags={tr.tags.map(t => t.tag.name) || []}
                                    truck={tr}
                                    onClick={() => setCurrentlySelected(i)}
                                />
                            ))}
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={7}>
                    <div className={classes.mapWrapper}>
                        <GoogleMap
                            center={{
                                lat:
                                    showingResults && truckResults.length > 0
                                        ? truckResults[0].currentLocation.latitude
                                        : props?.coords?.latitude || 31.5489,
                                lng:
                                    showingResults && truckResults.length > 0
                                        ? truckResults[0].currentLocation.longitude
                                        : props?.coords?.longitude || -97.1131,
                            }}
                            withInfoWindow
                        >
                            {showingResults &&
                                truckResults.map(
                                    (tr, i) =>
                                        tr.currentLocation && (
                                            <Marker
                                                key={i}
                                                position={{
                                                    lat: tr.currentLocation.latitude,
                                                    lng: tr.currentLocation.longitude,
                                                }}
                                                label={markerCount < 5 ? `${++markerCount}` : undefined}
                                                title={tr.name}
                                                animation="drop"
                                            >
                                                <div className="title full-width">{tr.name}</div>
                                                <div className="address-line full-width">{tr.description}</div>
                                                <Link href={`/trucks/${tr.id}`}>View Truck Info Page</Link>
                                            </Marker>
                                        )
                                )}
                            <Marker
                                variant="circle"
                                disableInfoWindow
                                position={{
                                    lat: props?.coords?.latitude || 31.5489,
                                    lng: props?.coords?.longitude || -97.1131,
                                }}
                            ></Marker>
                        </GoogleMap>
                    </div>
                </Grid>
            </Grid>
            <Snackbar
                open={errorOpen}
                autoHideDuration={5000}
                onClose={(_event, reason) => {
                    if (reason === 'clickaway') {
                        return;
                    }

                    setErrorOpen(false);
                }}
                onExited={() => setErrorSeverity('error')}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    variant="filled"
                    severity={errorSeverity}
                    onClose={() => {
                        setErrorOpen(false);
                    }}
                >
                    {errorMsg}
                </Alert>
            </Snackbar>
        </Container>
    );
}
SearchPage.propTypes = {
    auth: PropTypes.any,
    coords: PropTypes.any,
    isGeolocationEnabled: PropTypes.any,
    isGeolocationAvailable: PropTypes.any,
    classes: PropTypes.any,
};

function mapStateToProps(state) {
    const { auth } = state;
    return { auth };
}

const mapDispatchToProps = {};

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 0,
})(connect(mapStateToProps, mapDispatchToProps)(SearchPage));
