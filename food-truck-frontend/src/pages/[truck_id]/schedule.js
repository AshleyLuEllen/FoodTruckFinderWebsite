import React, { Component } from 'react';
import Link from "next/link";
import axios from "axios";
import { withRouter } from "next/router";
import { connect } from "react-redux";

class Schedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
         //   truck_id: '',
            location: '',
            time_from: '',
            time_to: '',
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.truckSchedule = this.truckSchedule.bind(this);
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

    truckSchedule() {

        const schedule = {
         //   truck_id: this.state.truck_id,
            location: this.state.location,
            time_from: this.state.time_from,
            time_to: this.state.time_to
        }

        axios.post(`${process.env.FOOD_TRUCK_API_URL}/saveschedule`, truck, {
            auth: {
                username: this.props.auth.email,
                password: this.props.auth.password
            }
        })
            .then((res) => {
                this.props.router.push(`/account/dashboard`);
            })
            .catch((err) => {
                alert(err);
                alert("Invalid Schedule/Location")
                console.log(err);
            });
    }

   // componentDidMount() {
      /*  axios.get(`${process.env.FOOD_TRUCK_API_URL}/truck/${this.props.router.query.truck_id}`).then(res => {
            this.setState({
                truck_id: res.data.truck_id,
                location: res.data.location,
                time_from: res.data.time_from,
                time_to: res.data.time_to
            });
            console.log("found the truck schedule!");
        }).catch(err => {
            this.setState({
                truck_id: 'empty',
                location: 'empty',
                time_from: 'empty',
                time_to: 'empty'
            });
        });*/
   // }

  /*  componentWillUpdate() {
        if (!this.state.truckFound) {
            axios.get(`${process.env.FOOD_TRUCK_API_URL}/truck/${this.props.router.query.truck_id}`).then(res => {
                this.setState({
                    truck_id: res.data.truck_id,
                    location: res.data.location,
                    time_to: res.data.time_to,
                    time_from: res.data.time_from,
                    editing: false
                });
                console.log(this.state);
            }).catch(err => {
                this.setState({
                    truck_id: 'empty',
                    location: 'empty',
                    time_to: 'empty',
                    time_from: 'empty',
                    editing: false
                });
            });
        }
    }*/

    render() {
        return (
            <div className="truck-schedule-form">
                <h2>Schedule</h2>
                <form onSubmit={this.handleSubmit} method="put">
                    <table className="schedule-details">
                        <tbody>
                        <tr>
                            <td>
                                <label for="sunday">
                                    Sunday:
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="locationSun">
                                    Location:
                                </label>
                            </td>
                            <td>
                                <input name="location" location="location" type="text"
                                       value={this.state.location} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="timeFromSun">
                                    From:
                                </label>
                            </td>
                            <td>
                                <input name="time_from" time_from="time_from" type="text"
                                       value={this.state.time_from} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="timeToSun">
                                    To:
                                </label>
                            </td>
                            <td>
                                <input name="time_to" time_to="time_to" type="text"
                                       value={this.state.time_to} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="monday">
                                    Monday:
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="locationMon">
                                    Location:
                                </label>
                            </td>
                            <td>
                                <input name="location" location="location" type="text"
                                       value={this.state.location} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="timeFromMon">
                                    From:
                                </label>
                            </td>
                            <td>
                                <input name="time_from" time_from="time_from" type="text"
                                       value={this.state.time_from} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="timeToMon">
                                    To:
                                </label>
                            </td>
                            <td>
                                <input name="time_to" time_to="time_to" type="text"
                                       value={this.state.time_to} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="tuesday">
                                    Tuesday:
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="locationTues">
                                    Location:
                                </label>
                            </td>
                            <td>
                                <input name="location" location="location" type="text"
                                       value={this.state.location} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="timeFromTues">
                                    From:
                                </label>
                            </td>
                            <td>
                                <input name="time_from" time_from="time_from" type="text"
                                       value={this.state.time_from} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="timeToTues">
                                    To:
                                </label>
                            </td>
                            <td>
                                <input name="time_to" time_to="time_to" type="text"
                                       value={this.state.time_to} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="wednesday">
                                    Wednesday:
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="locationWed">
                                    Location:
                                </label>
                            </td>
                            <td>
                                <input name="location" location="location" type="text"
                                       value={this.state.location} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="timeFromWed">
                                    From:
                                </label>
                            </td>
                            <td>
                                <input name="time_from" time_from="time_from" type="text"
                                       value={this.state.time_from} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="timeToWed">
                                    To:
                                </label>
                            </td>
                            <td>
                                <input name="time_to" time_to="time_to" type="text"
                                       value={this.state.time_to} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="thursday">
                                    Thursday:
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="locationThur">
                                    Location:
                                </label>
                            </td>
                            <td>
                                <input name="location" location="location" type="text"
                                       value={this.state.location} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="timeFromThur">
                                    From:
                                </label>
                            </td>
                            <td>
                                <input name="time_from" time_from="time_from" type="text"
                                       value={this.state.time_from} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="timeToThur">
                                    To:
                                </label>
                            </td>
                            <td>
                                <input name="time_to" time_to="time_to" type="text"
                                       value={this.state.time_to} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="friday">
                                    Friday:
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="locationFri">
                                    Location:
                                </label>
                            </td>
                            <td>
                                <input name="location" location="location" type="text"
                                       value={this.state.location} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="timeFromFri">
                                    From:
                                </label>
                            </td>
                            <td>
                                <input name="time_from" time_from="time_from" type="text"
                                       value={this.state.time_from} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="timeToFri">
                                    To:
                                </label>
                            </td>
                            <td>
                                <input name="time_to" time_to="time_to" type="text"
                                       value={this.state.time_to} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="saturday">
                                    Saturday:
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="locationSat">
                                    Location:
                                </label>
                            </td>
                            <td>
                                <input name="location" location="location" type="text"
                                       value={this.state.location} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="timeFromSat">
                                    From:
                                </label>
                            </td>
                            <td>
                                <input name="time_from" time_from="time_from" type="text"
                                       value={this.state.time_from} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="timeToSat">
                                    To:
                                </label>
                            </td>
                            <td>
                                <input name="time_to" time_to="time_to" type="text"
                                       value={this.state.time_to} onChange={this.handleInputChange} />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <button className="schedule-submit-button" onClick={this.truckSchedule}>
                        Save Changes
                    </button>
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

function mapStateToProps(state) {
    const { auth } = state
    return { auth }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Schedule));