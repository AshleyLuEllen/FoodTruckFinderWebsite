import React, { Component } from 'react';
import Link from "next/link";
import axios from "axios";
import { withRouter } from "next/router";
import { connect } from "react-redux";

class CreateNewTruck extends Component {

    constructor(props) {
        super(props);
        this.state = {license_plate: '', payment_types: '', description:'', truck_name:''};
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

    }

    createNewTruck(){
        const truck = {
            licensePlate: this.state.license_plate,
            payment_types: this.state.payment_types,
            description: this.state.description,
            name: this.state.truck_name
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
            })
            ;

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
                    <Link href="/owner/trucks">
                        <a>Cancel</a>
                    </Link>
                </li>
            </div>
        );
    }
}
function mapStateToProps(state) {
    const { auth } = state
    return { auth }
}
  
const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateNewTruck));