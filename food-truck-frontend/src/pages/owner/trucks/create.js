import React, { Component } from 'react';
import Link from "next/link";
import axios from "axios";
import { withRouter } from "next/router";
import { connect } from "react-redux";
import {Button, Grid, InputLabel, TextField} from "@material-ui/core";
import ChipSelector from "../../../components/ChipSelector";

class CreateNewTruck extends Component {

    constructor(props) {
        super(props);
        this.state = {
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
        console.log(tag);
        this.setState({ truckTags: tag});
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleCancel = () => {
        this.props.router.push(`/owner/trucks/${this.state.id}`);
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
            <Grid container spacing={4} >
                <Grid item xs={12}>
                    <InputLabel>
                        Food Truck Name
                    </InputLabel>
                    <TextField
                        id="name"
                        label=""
                        value=""
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
                        value=""
                        fullWidth={true}
                        onChange={e => this.handleInputChange(e, "licensPlate")}
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
                        defaultValue=""
                        onChange={e => this.handleInputChange(e, "description")}
                    />
                </Grid>
                <Grid item xs={12} >
                    <ChipSelector
                        label="Tags"
                        options={this.state.allTags}
                        selectedOptions={this.state.truckTags}
                        onChange={(event, value) => { this.handleTagChange(event, value) }}
                        onSelectOption={t => axios.post(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.state.id}/tags/${t.id}`, {},
                            { auth: {
                                    username: this.props.auth.email,
                                    password: this.props.auth.password
                                }}).then().catch(error => {
                            console.log(error.message);
                        })}
                        onDeselectOption={t => axios.delete(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.state.id}/tags/${t.id}`,
                            { auth: {
                                    username: this.props.auth.email,
                                    password: this.props.auth.password
                                }}).then().catch(error => {
                            console.log(error.message);
                        })}
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
        </div>)
    }

    // render() {
    //     return (
    //         <div className="create-truck-form">
    //             <h2>Create New Truck</h2>
    //             <form onSubmit={this.handleSubmit} method="post">
    //                 <table className="truck-form-details">
    //                     <tbody>
    //                     <tr>
    //                         <td>
    //                             <label htmlFor="description">
    //                                 Description:
    //                             </label>
    //                         </td>
    //                         <td>
    //                             <input name="description" type="text" value={this.state.description} onChange={this.handleInputChange}/>
    //                         </td>
    //                     </tr>
    //                     <tr>
    //                         <td>
    //                             <label htmlFor="truck_name">
    //                                 Truck Name:
    //                             </label>
    //                         </td>
    //                         <td>
    //                             <input name="truck_name" type="text" value={this.state.truck_name} onChange={this.handleInputChange} />
    //                         </td>
    //                     </tr>
    //                     <tr>
    //                         <td>
    //                             <label htmlFor="license_plate">
    //                                 Plate Number:
    //                             </label>
    //                         </td>
    //                         <td>
    //                             <input name="license_plate" type="text" value={this.state.license_plate} onChange={this.handleInputChange} />
    //                         </td>
    //                     </tr>
    //                     </tbody>
    //                 </table>
    //                 <button className="login-submit-button" onClick={this.createNewTruck}>Create Truck</button>
    //             </form>
    //             <br />
    //             <label>{this.state.message}</label>
    //             <li>
    //                 <Link href="/owner/trucks">
    //                     <a>Cancel</a>
    //                 </Link>
    //             </li>
    //         </div>
    //     );
    // }
}
function mapStateToProps(state) {
    const { auth } = state
    return { auth }
}
  
const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateNewTruck));