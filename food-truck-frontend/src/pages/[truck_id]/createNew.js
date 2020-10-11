import React, { Component } from 'react';
import Link from "next/link";
import axios from "axios";
import withRouter from "next/dist/client/with-router";

class CreateNewTruck extends Component {

    constructor(props) {
        super(props);
        this.state = {license_plate: '', payment_types: '', description:'', truck_name:'', owner:''};
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createNewTruck = this.createNewTruck.bind(this);
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

    componentDidMount() {
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/me`)
            .then(res => {
                this.setState({
                    owner: res.data.id
                });
            })
            .catch(err => {
                console.log(err.response?.status);
                console.log(err);
            })
    }

    createNewTruck(){
        const truck = {
            license_plate: this.state.license_plate,
            payment_types: this.state.payment_types,
            description: this.state.description,
            truck_name: this.state.truck_name,
            owner: {
                id: this.state.owner
            }
        }

        axios.post(process.env.FOOD_TRUCK_API_URL + "/createtruck", truck)
            .then((res) => {
                this.props.router.push('/dashboard')
            })
            /*
            .catch((err) => {
                alert("Truck already exists.")
                console.log(err);
            })
            ;
             */

        console.log("create truck!");
    }

    render() {
        return (
            <div className="create-truck-form">
                <h2>Create New Truck</h2>
                <form onSubmit={this.handleSubmit} method="post">
                    <table className="truck-form-details">
                        <tbody>
                        <tr>
                            <td>
                                <label htmlFor="license_plate">
                                    Plate Number:
                                </label>
                            </td>
                            <td>
                                <input name="license_plate" type="text" value={this.state.license_plate} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="payment_types">
                                    Payment Types:
                                </label>
                            </td>
                            <td>
                                <input name="payment_types" type="text" value={this.state.payment_types} onChange={this.handleInputChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="description">
                                    Description:
                                </label>
                            </td>
                            <td>
                                <input name="description" type="text" value={this.state.description} onChange={this.handleInputChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="truck_name">
                                    Truck Name:
                                </label>
                            </td>
                            <td>
                                <input name="truck_name" type="text" value={this.state.truck_name} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <button className="login-submit-button" onClick={this.createNewTruck}>Create Truck</button>
                </form>
                <br />
                <label>{this.state.message}</label>
                <li>
                    <Link href="/">
                        <a>Cancel</a>
                    </Link>
                </li>
            </div>
        );
    }
}
export default withRouter(CreateNewTruck);