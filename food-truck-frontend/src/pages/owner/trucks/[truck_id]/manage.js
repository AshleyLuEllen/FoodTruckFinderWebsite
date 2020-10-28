import React, { Component } from 'react';
import axios from "axios";
import { withRouter } from 'next/router';
import { connect } from "react-redux";
import {Menu, FormControlLabel, MenuItem, Checkbox, Button, TextField, Container, Grid, InputLabel} from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

/**
 * Information page for the food trucks which includes an editing form if you're the
 * authenticated owner
 */
class ManagePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            name: '',
            description: '',
            licensePlate: '',
            paymentTypes: 0,
            owner: '',
            tags: [],

            truckFound: false,
            cancelDialog: false,
            menuOpen: false,
            anchor: null
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleClick = (e) => {
        this.setState({
            menuOpen: true,
            anchor: e.currentTarget
        });
        console.log(this.state);
    }

    handleClose = (e) => {
        this.setState({
            menuOpen: false
        });
    }

    /**
     * Sets the state value to the value in the form
     * @param event the source of the new value in the state
     */
    handleInputChange(event, name_of_attribute, index_in_tags, tag_info) {
        console.log(event.target);
        if(name_of_attribute !== "tags") {
            this.setState({
                [name_of_attribute]: event.target.value
            });
        }
        else {
            console.log(index_in_tags);
            console.log(tag_info);
            const newTags = this.state.tags.splice();
            newTags[index_in_tags] = {index_in_tags, tag_info};
            this.setState({ tags: newTags});
        }
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleCancel = () => {
        this.props.router.push(`/owner/trucks/${this.state.id}`);
    }

    /**
     * Saves the edited information from the form
     */
    saveInfo = () => {
        const truck = {
            id: this.state.id,
            name: this.state.name,
            description: this.state.description,
            licensePlate: this.state.licensePlate,
            paymentTypes: Number(this.state.paymentTypes),
            owner: this.state.owner
        }

        axios.put(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.state.id}`, truck)
            .then((res) => {
                this.props.router.push(`/owner/trucks/${res.data.id}`)
                    .then(r => console.log("Truck Edited"))
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    /**
     * Removes the truck that's currently being edited
     */
    removeTruck = () => {
        console.log(this.state);
        console.log(this.props.auth);
        axios.delete(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.state.id}`,
            { auth: {
                    username: this.props.auth.email,
                    password: this.props.auth.password
                }})
            .then((res) => {
                console.log(res.statusText);
                this.props.router.push("/owner/trucks").then();
            })
            .catch((err) => {
                console.log(err.message);
            })
    }

    /**
     * Displays all the information about the truck who's id is being
     * used in the URL
     */
    componentDidMount() {
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}`).then(res => {
            this.setState({
                id: res.data.id,
                name: res.data.name,
                description: res.data.description,
                licensePlate: res.data.licensePlate,
                paymentTypes: res.data.paymentTypes,
                owner: res.data.owner.id,
                tags: [{id:0, name:["food", false]}, {id: 1, name: ["beer", true]}, {id: 2, name: ["bar", true]},
                    {id: 3, name: ["lively", false]}, {id: 4, name: ["cheap", true]}, {id: 5, name: ["quick bite", false]}],

                truckFound: true,
                cancelDialog: false,
                anchor: null
            });
            console.log("found the truck!");
        }).catch((err) => {
            this.setState({
                id: 'empty',
                name: 'empty',
                description: 'empty',
                licensePlate: 'empty',
                paymentTypes: 0,
                owner: 'empty',
                truckFound: false,
                cancelDialog: false,
                anchor: null
            });
        });
    }

    /**
     * Continuously updates the truck information on the page
     */
    componentWillUpdate() {
        if(!this.state.truckFound) {
            axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}`).then(res => {
                this.setState({
                    id: res.data.id,
                    name: res.data.name,
                    description: res.data.description,
                    licensePlate: res.data.licensePlate,
                    paymentTypes: res.data.paymentTypes,
                    owner: res.data.owner,
                    tags: [["food", false], ["beer", true], ["bar", true], ["lively", false], ["cheap", true], ["quick bite", false]],

                    truckFound: true,
                    cancelDialog: false,
                    anchor: null
                });
                console.log(this.state);
            }).catch(err => {
                this.setState({
                    id: '',
                    name: '',
                    description: '',
                    licensePlate: '',
                    paymentTypes: 0,
                    owner: '',
                    tags: [],

                    truckFound: false,
                    cancelDialog: false,
                    anchor: null
                });
            });
        }
    }

    render() {
        return (
            <div>
                <Container>
                    <h1>{this.state.name}</h1>
                    <Grid container spacing={4} >
                        <Grid item xs={12}>
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
                                onChange={e => this.handleInputChange(e, "licensPlate")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel>
                                Payment Types
                            </InputLabel>
                            <TextField
                                id="paymentTypes"
                                label=""
                                value={this.state.paymentTypes}
                                fullWidth={true}
                                onChange={e => this.handleInputChange(e,"paymentTypes")}
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
                        <Grid item xs={6} sm={3}>
                            <Button
                                variant="outlined"
                                color="primary"
                                width={1/3}
                                onClick={this.handleClick}>
                                Edit Tags
                            </Button>
                            <Menu
                                id="simple-menu"
                                keepMounted
                                open={this.state.menuOpen}
                                onClose={this.handleClose}
                                anchorEl={this.state.anchor}
                            >
                                {this.state.tags.map(t => (
                                    <MenuItem>
                                        <FormControlLabel
                                            value={t[0]}
                                            control={
                                                <Checkbox
                                                    color="primary"
                                                    checked={t[1]}
                                                    onChange={e => this.handleInputChange(e, "tags", t.id,[t[0], !t[1]])}
                                                    name="checkedF"
                                                    indeterminate
                                                />}
                                            label={t[0]}
                                            labelPlacement="right"
                                        />
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Grid>

                        {/*{this.state.tags.map(t => (*/}
                        {/*    <Grid xs={12}>*/}
                        {/*        <FormControlLabel*/}
                        {/*            control={*/}
                        {/*                <Checkbox*/}
                        {/*                    checked={t[1]}*/}
                        {/*                    onChange={e => this.handleInputChange(t.name, "tags", t.id)}*/}
                        {/*                    name="checkedF"*/}
                        {/*                    indeterminate*/}
                        {/*                />*/}
                        {/*            }*/}
                        {/*            label={t[0]}>*/}
                        {/*        </FormControlLabel>*/}
                        {/*    </Grid>*/}
                        {/*))}*/}

                        <Grid item xs={6} sm={3}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={this.saveInfo}
                                width={1/3}>
                                Save
                            </Button>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={this.removeTruck}
                                width={1/3}>
                                Delete
                            </Button>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={this.handleCancel}
                                href={`/owner/trucks/${this.state.id}`}
                                width={1/3}>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        );
    }

    // render() {
    //     return (
    //         <div>
    //             <h2>{this.state.name}</h2>
    //             <form onSubmit={this.handleSubmit} method="post">
    //                 <span>{this.state.editingMessage}</span>
    //                 <table className="truck-form-details">
    //                     <tbody>
    //                     <tr>
    //                         <td>
    //                             <label htmlFor="name">
    //                                 Name:
    //                             </label>
    //                         </td>
    //                         <td>
    //                             <input name="name" type="text" value={this.state.name}
    //                                    onChange={this.handleInputChange}/>
    //                         </td>
    //                     </tr>
    //                     <tr>
    //                         <td>
    //                             <label htmlFor="description">
    //                                 Description:
    //                             </label>
    //                         </td>
    //                         <td>
    //                             <input name="description" type="text" value={this.state.description}
    //                                    onChange={this.handleInputChange}/>
    //                         </td>
    //                     </tr>
    //                     <tr>
    //                         <td>
    //                             <label htmlFor="licensePlate">
    //                                 License Plate:
    //                             </label>
    //                         </td>
    //                         <td>
    //                             <input name="licensePlate" type="text" value={this.state.licensePlate}
    //                                    onChange={this.handleInputChange}/>
    //                         </td>
    //                     </tr>
    //                     <tr>
    //                         <td>
    //                             <label htmlFor="paymentTypes">
    //                                 Payment Types:
    //                             </label>
    //                         </td>
    //                         <td>
    //                             <input name="paymentTypes" type="text" value={this.state.paymentTypes}
    //                                    onChange={this.handleInputChange}/>
    //                         </td>
    //                     </tr>
    //                     </tbody>
    //                 </table>
    //                 <button onClick={this.saveInfo}>Save</button>
    //             </form>
    //             <button onClick={this.removeTruck}>Delete Truck</button>
    //             <br />
    //             <br/>
    //             <Link href={`/owner/trucks/${this.state.id}`}>
    //                 <a>Cancel</a>
    //             </Link>
    //         </div>
    //     );
    // }
}
const mapStateToProps = state => {
    const { auth } = state
    return { auth }
};

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManagePage));