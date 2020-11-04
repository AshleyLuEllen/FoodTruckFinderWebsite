import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles'
import { TextField, Divider, Grid, Container, Typography, Button, Box } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import ChipSelector from '../components/ChipSelector';
import TruckMap from '../components/TruckMap';
import SubscriptionCard from '../components/SubscriptionCard';
import LocationInput from '../components/LocationInput';

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

    useEffect(() => {
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/tags`)
            .then(res => {
                setTagOptions(res.data);
                // setSelectedTags(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    return (
        <ul>
            <Container className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
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
                        <Button
                            className={classes.searchButton}
                            onClick={() => alert("hi")}
                            variant="contained"
                            color="primary"
                        >
                                Search!
                        </Button>
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