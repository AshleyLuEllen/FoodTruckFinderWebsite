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
            truckFound: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChangeStatus(event) {
    }
    handleInputChange(event) {
    }
    handleSubmit(event) {
    }
    componentDidMount() {
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/truck/${this.props.router.query.truck_id}`).then(res => {
            this.setState({
                id: res.data.id,
                name: res.data.name,
                description: res.data.description,
                licensePlate: res.data.licensePlate,
                paymentTypes: res.data.paymentTypes,
                owner: res.data.owner,
                truckFound: true
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
                truckFound: false
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
                    truckFound: true
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
                    truckFound: false
                });
            });
        }
    }

    render() {
        console.log(this.state);
        return (
            <div>
                <h2>{this.state.name}</h2>
                {this.state.truckFound && <h3>Description:</h3>}
                {this.state.truckFound && <span>{this.state.description}</span>}
                {this.state.truckFound && <h3>License Plate:</h3>}
                {this.state.truckFound && <span>{this.state.licensePlate}</span>}
                {this.state.truckFound && <h3>Payment Types:</h3>}
                {this.state.truckFound && <span>{this.state.paymentTypes}</span>}
                {this.state.truckFound && <h3>Owner:</h3>}
                {this.state.truckFound && <span>{this.state.owner.firstName + ' ' + this.state.owner.lastName}</span>}
                {this.state.truckFound && <h3>Tags:</h3>}
                {this.state.truckFound && <span>To be added in our next update.</span>}
                {this.state.truckFound && <h3>Schedule and Route:</h3>}
                {this.state.truckFound && <li>
                    <Link href={`/${this.state.id}/schedule`}>
                        <a>Schedule and Route</a>
                    </Link>
                </li>}
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
            </div>
        );
    }
}
export default withRouter(Information);