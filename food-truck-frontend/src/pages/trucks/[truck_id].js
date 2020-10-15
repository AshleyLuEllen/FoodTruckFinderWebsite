import React, { Component } from 'react';
import Link from "next/link";
import axios from "axios";
import { withRouter } from 'next/router';
import { connect } from "react-redux";

/**
 * Information page for the food trucks which includes an editing form if you're the
 * authenticated owner
 */
class TruckPage extends Component {
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
                        <Link href={`/`}>
                            <a>Back</a>
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }
}
const mapStateToProps = state => {
    const { auth } = state
    return { auth }
};

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TruckPage));