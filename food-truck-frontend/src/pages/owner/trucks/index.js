import React, { Component } from 'react';
import Link from "@material-ui/core/Link";
import axios from "axios";
import {login as authLogin, logout as authLogout} from "../../../redux/actions/auth";
import {withRouter} from "next/router";
import { connect, useDispatch } from 'react-redux';
import OwnerTruckCard from "../../../components/OwnerTruckCard";
import withStyles from "@material-ui/core/styles/withStyles";
import TruckCard from "../../../components/TruckCard";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add'
import Box from "@material-ui/core/Box";

const dashboardStyles = theme => ({
    truckCard: {
        marginBottom: '5px'
    },
    links: {
        marginLeft: '35px',
    }
});

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {truckData: [] };
        //this.state = {email: '', password: ''};
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChangeStatus(event) {
    }
    handleInputChange(event) {
    }
    handleSubmit(event) {
        this.props.history.push('/')
    }
    componentDidMount() {

        axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/me`, {
            auth: {
                username: this.props.auth.email,
                password: this.props.auth.password
            }
        })
            .then(res => {
                this.setState({
                    owner: res.data.id
                })

                let userID = this.state.owner;

                //let userID = 1;
                axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/${userID}/trucks`)
                    .then(res => {
                        this.setState({
                            truckData: res.data
                        });
                    })
                    .catch(err => {
                        console.log(err.response?.status);
                        console.log(err);
                    });

            })
            .catch(err => {
                console.log(err.response?.status);
                console.log(err);
            })
    }

    componentWillUpdate = () => {
        console.log(this.props.router.query);
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/${this.props.router.query.user_id}/trucks`)
            .then(res => {
                this.setState({
                    truckData: res.data
                });
            })
            .catch(err => {
                console.log(err.response?.status);
                console.log(err);
            })
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Typography variant={'h2'}>
                    My Trucks
                </Typography>
                <ol>
                    {this.state.truckData.map((tr, i) => (
                        <OwnerTruckCard key={i} className={classes.truckCard} truck={tr} tags={tr.tags.map(tag => tag.tag.name)} onClick={evt => this.setState({currentlySelected: i})} userId={this.state.userId}/>
                    ))}
                </ol>
                {this.state.truckData.length > 0 &&
                    <Box ml={5}>
                        <Button variant={"contained"} href="/owner/trucks/create">
                            <AddIcon/>
                        </Button>
                    </Box>
                }
                {this.state.truckData.length === 0 &&
                <Typography className={classes.links} variant={'button'}>
                    Click <Link href="/owner/trucks/create">here</Link> to add your first Truck!
                </Typography>}
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { auth } = state
    return { auth }
}

const mapDispatchToProps = {
    authLogin,
    authLogout
}

export default withStyles(dashboardStyles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard)));