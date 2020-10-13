import React, { Component } from 'react';
import Link from "next/link";
import axios from "axios";
import { withRouter } from 'next/router';
import { connect } from "react-redux";

/**
 * Information page for the food trucks which includes an editing form if you're the
 * authenticated owner
 */
class Information extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            name: '',
            description: '',
            licensePlate: '',
            paymentTypes: 0,
            owner: '',

            truckFound: false,

            // Will display the form when true and will display any error messages while editing
            editing: false,
            editingMessage: ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Sets the state value to the value in the form
     * @param event the source of the new value in the state
     */
    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    /**
     * Checks that the user is authenticated and authorized to edit this
     * truck's information.
     */
    editForm = (() => {
        axios.get(process.env.FOOD_TRUCK_API_URL + "/users/me",
        {
            auth: {
                username: this.props.auth.email,
                password: this.props.auth.password
            }
        }
        ).then(
            this.setState({
                editing: true,
                editingMessage: ''
            })
        ).catch((err) => {
            console.log(err);
            alert("Only truck owners can edit the truck");
        });


    })

    /**
     * Saves the edited information from the form
     */
    saveInfo = (() => {
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
                console.log("saved truck!");
                this.props.router.push(`/owner/trucks/${res.data.id}`).then(r =>
                    this.setState ( {
                    editing: false
                }));

            })
            .catch((err) => {
                this.setState({
                    editingMessage: err.message
                });
            });
    })

    /**
     * Removes the truck that's currently being edited
     */
    removeTruck = (() => {
        console.log(this.state);
        axios.delete(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.state.id}`,
            { auth: {
                        username: this.props.auth.email,
                        password: this.props.auth.password
                    }})
        .then((res) => {
            console.log(res.statusText);
            this.props.router.push("/owner/trucks");
            this.setState({
                editing: false
            });
        })
        .catch((err) => {
            this.setState({
                editingMessage: err.message
            });
        })
    });

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
                truckFound: true,
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
                    truckFound: true,
                    editing: false
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
                    truckFound: false,
                    editing: false
                });
            });
        }
    }

    render() {
        /**
         * If the truck is not being edited, just display the information
         */
        if(!this.state.editing) {
            return (
                <div>
                    <h2>{this.state.name}</h2>
                    {this.state.truckFound && <tr>
                        <td><h3>Description: </h3></td>
                        <td><span>{this.state.description}</span></td>
                    </tr>}
                    {this.state.truckFound &&
                    <tr>
                        <td><h3>License Plate: </h3></td>
                        <td><span>{this.state.licensePlate}</span></td>
                    </tr>}
                    {this.state.truckFound &&
                    <tr>
                        <td><h3>Payment Types: </h3></td>
                        <td><span>{this.state.paymentTypes}</span></td>
                    </tr>}
                    {this.state.truckFound &&
                    <tr>
                       <td><h3>Owner: </h3></td>
                       <td><span>{this.state.owner.firstName + ' ' + this.state.owner.lastName}</span></td>
                    </tr>}
                    {this.state.truckFound &&
                    <tr>
                        <td><h3>Tags: </h3></td>
                        <td><span>To be added in our next update.</span></td>
                    </tr>}
                    <ul>
                        <li>
                            <Link href={`/owner/trucks/${this.props.router.query.truck_id}/manage`}>
                                <a>Manage Truck</a>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/owner/trucks/${this.props.router.query.truck_id}/notifications`}>
                                <a>Notifications</a>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/owner/trucks/${this.props.router.query.truck_id}/schedule`}>
                                <a>Truck Schedule</a>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/owner/trucks`}>
                                <a>Back</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                <a>Home</a>
                            </Link>
                        </li>
                    </ul>
                    <br/>
                    <button className="edit-submit-button" onClick={this.editForm}>Edit</button>
                </div>
            );
        }
        /**
         * If the truck is being edited, display a form
         */
        else {
            return (
                <div>
                    <h2>{this.state.name}</h2>
                    <form onSubmit={this.handleSubmit} method="post">
                        <span>{this.state.editingMessage}</span>
                        <table className="truck-form-details">
                            <tbody>
                            <tr>
                                <td>
                                    <label htmlFor="name">
                                        Name:
                                    </label>
                                </td>
                                <td>
                                    <input name="name" type="text" value={this.state.name}
                                           onChange={this.handleInputChange}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="description">
                                        Description:
                                    </label>
                                </td>
                                <td>
                                    <input name="description" type="text" value={this.state.description}
                                           onChange={this.handleInputChange}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="licensePlate">
                                        License Plate:
                                    </label>
                                </td>
                                <td>
                                    <input name="licensePlate" type="text" value={this.state.licensePlate}
                                           onChange={this.handleInputChange}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="paymentTypes">
                                        Payment Types:
                                    </label>
                                </td>
                                <td>
                                    <input name="paymentTypes" type="text" value={this.state.paymentTypes}
                                           onChange={this.handleInputChange}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <button onClick={this.saveInfo}>Save</button>
                    </form>
                    <button onClick={this.removeTruck}>Delete Truck</button>
                    <br />
                    <br/>
                    <Link href={`/${this.state.id}/information`}>
                            <a>Cancel</a>
                    </Link>
                </div>
            );
        }
    }
}
const mapStateToProps = state => {
    const { auth } = state
    return { auth }
};

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Information));