import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles'
import { TextField, Divider, Grid, Container, Typography, Button, Box, CircularProgress, Paper } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { green } from '@material-ui/core/colors';
import ChipSelector from '../components/ChipSelector';
import TruckMap from '../components/TruckMap';
import SubscriptionCard from '../components/SubscriptionCard';
import LocationInput from '../components/LocationInput';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: '20px'
    },
    queryField: {
        width: "100%",
        marginBottom: '10px'
    },
    mapWrapper: {
        position: 'relative',
        width: '100%',
        height: '87vh'
    },
    truckCard: {
        marginBottom: '5px'
    },
    searchButton: {
        height: "auto",
        width: "50%",
        display: "block",
        margin: "0 auto",
        marginBottom: "10px"
    },
    ratingContainer: {
        display: "flex",
        height: "50px",
        alignItems: "center",
        justifyContent: "center"
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
        transition: '0.5s all'
    },
    resultsVisible: {
        left: 0
    }
}));

function SearchPage(props) {
    const classes = useStyles();

    const [tagOptions, setTagOptions] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [trucks, setTrucks] = useState([]);
    const [currentlySelected, setCurrentlySelected] = useState(undefined);
    const [showingResults, setShowingResults] = useState(false);
    const [preferredRating, setPreferredRating] = useState(null);
    const [location, setLocation] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const timer = React.useRef();

    useEffect(() => {
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/tags`)
            .then(res => {
                setTagOptions(res.data);
                console.log(res.data);
                const truckTags = [{id: 1, name: "A", description: "Test description"}];
                setSelectedTags(res.data.filter(t => truckTags.findIndex(tt => tt.id == t.id) != -1));
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    const resultsPageClass = clsx({
        [classes.resultsVisible]: showingResults,
    });

    const handleButtonClick = () => {
        if (!loading) {
          setShowingResults(false);
          setLoading(true);
          timer.current = window.setTimeout(() => {
            setShowingResults(true);
            setLoading(false);
          }, 2000);
        }
    };

    return (
        <ul>
            <Container className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4} style={{position: "relative"}}>
                        <Typography variant="h4" style={{ marginBottom: "10px", textAlign: "center" }}>Search</Typography>
                        <TextField
                            className={classes.queryField}
                            label="Name or Description"
                            variant="outlined"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        <div className={classes.queryField}>
                            <ChipSelector
                                label="Tags"
                                options={tagOptions}
                                selectedOptions={selectedTags}
                                onChange={(event, value) => setSelectedTags(value)}
                                onSelectOption={t => console.log(t)}
                                onDeselectOption={t => console.log(t)}
                            />
                        </div>
                        <LocationInput onChange={(event, value) => {
                            console.log(value);
                            // TODO: get coordinates on server-side
                        }}/>
                        <div className={classes.ratingContainer}>
                            <Typography variant="h6" style={{ marginRight: "20px" }}>Minimum Rating</Typography>
                            <Rating
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
                                color="primary"
                                style={{ width: "auto", height: "auto", textAlign: "center" }}
                                onClick={() => setShowingResults(false)}
                            >
                                <ArrowBackIosIcon/> Back to Search
                            </Button>
                            <Typography variant="h4" style={{ marginTop: "10px", marginBottom: "10px", textAlign: "center" }}>Search Results</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <div className={classes.mapWrapper}>
                            <TruckMap trucks={trucks} selected={currentlySelected}/>
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </ul>
    )
}

function mapStateToProps(state) {
    const { auth } = state
    return { auth }
  }

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);