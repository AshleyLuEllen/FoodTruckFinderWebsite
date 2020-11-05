import React, { Component } from 'react';
import axios from "axios";
import Link from "next/link";
import {withRouter} from 'next/router';
import {connect} from "react-redux";
import {Card, CardHeader, IconButton, TextField, InputLabel} from "@material-ui/core";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";

/**
 * Information page for the food trucks which includes an editing form if you're the
 * authenticated owner
 */
class NotificationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            truck: "",
            truckName: "",
            truckID: 1,
            notifications: [],
            truckFound: false,

            openNotification: 1,
            open: false,
            subject: "",
            description: ""
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUpdate = this.componentWillUpdate.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.getData = this.getData.bind(this);
    }

    handleClick(notification) {
        if(notification !== null) {
            axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.state.truckID}/notifications/${notification.id}`)
                .then(res => (
                    this.setState({
                        openNotification: notification.id,
                        open: true,
                        subject: res.data.subject,
                        description: res.data.description
                    })
                ))
        }
        else {
            const notification = {
                id: null,
                truck: this.state.truck,
                media: null,
                subject: "",
                description: "",
                type: null,
                published: false
            }
            axios.post(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.state.truckID}/notifications`, notification)
                .then(res => (
                    this.setState( {
                        openNotification: res.data.id,
                        open: true,
                        subject: res.data.subject,
                        description: res.data.description
                    })
                ));
        }
    }

    handleClose(option) {
        this.setState({ open: false });

        const notification = {
            id: this.state.openNotification,
            truck: this.state.truck,
            media: null,
            subject: this.state.subject,
            description: this.state.description,
            type: null,
            published: option
        }

        axios.post(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/notifications`, notification)
            .then(res => console.log("Notification saved!"))
            .catch(err => console.log(err.message));
    }

    handleCancel() {
        this.setState({ open: false });
    }

    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleDelete() {
        axios.delete(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/notifications/${this.state.openNotification}`,
            {
                auth: {
                    username: this.props.auth.username,
                    password: this.props.auth.password
                }
            })
            .then(r => console.log("Notification deleted!"))
            .catch(err => console.log(err.message));
    }

    getData() {

    }

    /**
     * Displays all the information about the truck who's id is being
     * used in the URL
     */
    componentDidMount() {

    }

    /**
     * Continuously updates the truck information on the page
     */
    componentWillUpdate() {
        if(!this.state.truckFound && this.props.router.query.truck_id !== undefined) {
            axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}`)
                .then(res => {
                    this.setState({
                        truck: res.data,
                        truckName: res.data.name,
                        truckID: res.data.id
                    });
                    return axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}}/notifications`)
                }).then(res2 => {
                    this.setState( {
                        notifications: res2.data,
                        truckFound: true
                    });
                    console.log(this.state);
                }).catch(err => console.log(err.message));
        }
        else {
            console.log("Router undefined");
            console.log(this.props.router);
        }
    }

    render() {
        return (
            <div>
                <h2>Notifications of {this.state.truck.name} </h2>
                {this.state.notifications.forEach(n =>
                    <Card onDoubleClick={this.handleClick(n)}>
                        <CardContent>
                            <CardHeader
                                title={<Link href={`owner/trucks/${this.state.truckID}/notifications/${n.id}`}>
                                    {n.subject}
                                </Link>}
                                subheader={n.description}
                            />
                        </CardContent>
                        <CardActions>
                            <Button onClick={this.handleClick(n)}> Manage </Button>
                        </CardActions>
                    </Card>
                )}
                {/*<Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">*/}
                {/*    <DialogTitle id="form-dialog-title">Manage Notification</DialogTitle>*/}
                {/*    <DialogContent>*/}
                {/*        <DialogContentText>*/}
                {/*            To subscribe to this website, please enter your email address here. We will send updates*/}
                {/*            occasionally.*/}
                {/*        </DialogContentText>*/}
                {/*        <TextField*/}
                {/*            autoFocus*/}
                {/*            margin="dense"*/}
                {/*            id="subject"*/}
                {/*            label="Subject"*/}
                {/*            type="email"*/}
                {/*            defaultValue={this.state.subject}*/}
                {/*            fullWidth={true}*/}
                {/*            onChange={e => this.handleInputChange(e, "description")}*/}
                {/*        />*/}
                {/*        <InputLabel>*/}
                {/*        </InputLabel>*/}
                {/*        <TextField*/}
                {/*            id="description"*/}
                {/*            label="Description"*/}
                {/*            multiline*/}
                {/*            rows={4}*/}
                {/*            fullWidth={true}*/}
                {/*            defaultValue={this.state.description}*/}
                {/*            onChange={e => this.handleInputChange(e, "description")}*/}
                {/*        />*/}
                {/*    </DialogContent>*/}
                {/*    <DialogActions>*/}
                {/*        <Button onClick={this.handleCancel} color="primary">*/}
                {/*            Cancel*/}
                {/*        </Button>*/}
                {/*        <Button onClick={this.handleClose(false)} color="primary">*/}
                {/*            Save*/}
                {/*        </Button>*/}
                {/*        <Button onClick={this.handleClose(true)} color="primary">*/}
                {/*            Publish*/}
                {/*        </Button>*/}
                {/*        <Button onClick={this.handleDelete} color="primary">*/}
                {/*            Delete*/}
                {/*        </Button>*/}
                {/*    </DialogActions>*/}
                {/*</Dialog>*/}
                {/*<Button onClick={this.handleClick(null)}> + </Button>*/}
            </div>
        )
    }
}
const mapStateToProps = state => {
    const { auth } = state
    return { auth }
};

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NotificationPage));