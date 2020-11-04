import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles'
import { TextField, Divider, Grid, Container, Typography, Button, Box } from '@material-ui/core';
import ChipSelector from '../components/ChipSelector';
import TruckMap from '../components/TruckMap';
import SubscriptionCard from '../components/SubscriptionCard';

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

    useEffect(() => {
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/tags`)
            .then(res => {
                setTagOptions(res.data);
                setSelectedTags(res.data);
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