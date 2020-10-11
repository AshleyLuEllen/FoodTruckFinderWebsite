import React, { Component } from 'react';
import Link from "next/link";
import axios from "axios";
import { withRouter } from 'next/router'

class Information extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            description: '',
            licensePlate: '',
            paymentTypes: 0,
            owner: '',
            truckFound: false,
            editing: false,
            editingMessage: ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeStatus(event) {
    }
    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    handleSubmit(event) {
        event.preventDefault();
    }

    editForm = (() => {
        console.log(this);
        axios.get(process.env.FOOD_TRUCK_API_URL + "/findMeUser")

        this.setState({
            editing: true,
            editingMessage: ''
        });
    })

    saveInfo = (() => {

        const truck = {
            id: this.state.id,
            name: this.state.name,
            description: this.state.description,
            licensePlate: this.state.licensePlate,
            paymentTypes: Number(this.state.paymentTypes),
            owner: this.state.owner
        }

        axios.post(`${process.env.FOOD_TRUCK_API_URL}/savetruck`, truck)
            .then((res) => {
                console.log("saved truck!");
                this.props.router.push(`/${res.data.id}/information`);
                this.setState ( {
                    editing: false
                });
            })
            .catch((err) => {
                this.setState({
                    editingMessage: err.message
                });
            });
    })

    removeTruck = (() => {
        axios.delete(`${process.env.FOOD_TRUCK_API_URL}/deleteTruck`, Number.valueOf(this.state.id))
            .then((res) => {
                console.log("deleted truck!");
                this.props.router.push(`/[truck_id]`);
                this.setState ( {
                    editing: false
                });
            })
            .catch((err) => {
                this.setState({
                    editingMessage: err.message
                });
            });
    })

    componentDidMount() {
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/truck/${this.props.router.query.truck_id}`).then(res => {
            this.setState({
                id: res.data.id,
                name: res.data.name,
                description: res.data.description,
                licensePlate: res.data.licensePlate,
                paymentTypes: res.data.paymentTypes,
                owner: res.data.owner,
                truckFound: true,
            });
            console.log("found the truck!");
        }).catch(err => {
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

    componentWillUpdate() {
        if(!this.state.truckFound) {
            axios.get(`${process.env.FOOD_TRUCK_API_URL}/truck/${this.props.router.query.truck_id}`).then(res => {
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
                    id: 'empty',
                    name: 'empty',
                    description: 'empty',
                    licensePlate: 'empty',
                    paymentTypes: 0,
                    owner: 'empty',
                    truckFound: false,
                    editing: false
                });
            });
        }
    }

    render() {
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
                    <li>
                        <Link href={`/${this.state.id}`}>
                            <a>Back</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/">
                            <a>Home</a>
                        </Link>
                    </li>
                    <br/>
                    <button className="edit-submit-button" onClick={this.editForm}>Edit</button>
                </div>
            );
        }
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
export default withRouter(Information);