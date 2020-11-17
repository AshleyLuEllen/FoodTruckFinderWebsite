import React, { Component } from 'react';
import Link from "next/link";
import axios from "axios";
import { withRouter } from "next/router";
import { connect } from "react-redux";
import {Button, Grid, InputLabel, TextField} from "@material-ui/core";
import ChipSelector from "../../../components/ChipSelector";
import Container from "@material-ui/core/Container";

class CreateNewTruck extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: -1,
            name: '',
            description: '',
            licensePlate: '',
            allTags: [],
            truckTags: [],

            truckFound: false,
            menuOpen: false,
            anchor: null
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createNewTruck = this.createNewTruck.bind(this);
    }

    handleChangeStatus(event) {
    }

    handleInputChange(event, name_of_attribute) {
        this.setState({
            [name_of_attribute]: event.target.value
        });
    }

    handleTagChange(event, tag) {
        if(tag.length < 6) {
            this.setState({ truckTags: tag});
        }
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleCancel = () => {
        this.props.router.push(`/owner/trucks`);
    }

    componentDidMount() {
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/tags`).then(r => {
            this.setState({
                allTags: r.data,
            });
        }).catch(error => {
            console.log(error.message);
        });
    }

    createNewTruck(){
        const truck = {
            licensePlate: this.state.licensePlate,
            payment_types: 0,
            description: this.state.description,
            name: this.state.name
        }

        axios.post(process.env.FOOD_TRUCK_API_URL + "/trucks", truck, {
            auth: {
                username: this.props.auth.email,
                password: this.props.auth.password
            }
        })
            .then((res) => {
                this.state.truckTags.forEach(t => {
                    axios.post(`${process.env.FOOD_TRUCK_API_URL}/trucks/${res.data.id}/tags/${t.id}`, {},
                        { auth: {
                                username: this.props.auth.email,
                                password: this.props.auth.password
                            }}).then().catch(error => {
                        console.log(error.message);
                    })
                })
                this.props.router.push('/owner/trucks')
            })
            .catch((err) => {
                alert(err);
                alert("Truck already exists.")
                console.log(err);
            });



        console.log("create truck!");
    }

    render() {
        return(
        <div>
            <Container>
                <Grid container spacing={4} >
                    <Grid item xs={12}>
                        <br/>
                        <InputLabel>
                            Food Truck Name
                        </InputLabel>
                        <TextField
                            id="name"
                            label=""
                            value={this.state.name}
                            fullWidth={true}
                            onChange={e => this.handleInputChange(e, "name")}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel>
                            License Plate Number
                        </InputLabel>
                        <TextField
                            id="licensePlate"
                            label=""
                            value={this.state.licensePlate}
                            fullWidth={true}
                            onChange={e => this.handleInputChange(e, "licensePlate")}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel>
                            Description
                        </InputLabel>
                        <TextField
                            id="description"
                            label=""
                            multiline
                            rows={4}
                            fullWidth={true}
                            defaultValue={this.state.description}
                            onChange={e => this.handleInputChange(e, "description")}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <ChipSelector
                            label="Tags"
                            options={this.state.allTags}
                            selectedOptions={this.state.truckTags}
                            onChange={(event, value) => { this.handleTagChange(event, value) }}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={this.createNewTruck}
                            width={1/3}>
                            Create
                        </Button>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={this.handleCancel}
                            href={`/owner/trucks`}
                            width={1/3}>
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </div>)
    }
}
function mapStateToProps(state) {
    const { auth } = state
    return { auth }
}
  
const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateNewTruck));