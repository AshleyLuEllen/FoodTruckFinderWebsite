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
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {format} from "date-fns";

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
            openCreate: false,
            subject: "",
            description: "",
            published: false,
            postedTimestamp: null
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

    handleClick(notification) {
        if(notification !== null) {
            axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.state.truckID}/notifications/${notification.id}`)
                .then(res => {
                    this.setState({
                        openNotification: notification.id,
                        open: true,
                        subject: res.data.subject,
                        description: res.data.description,
                        published: res.data.published,
                        postedTimestamp: res.data.postedTimestamp
                    });
                    console.log(this.state);
                    this.fetchData();
            }).catch(err => console.log(err.message));
        }
        else {
            this.setState({
                openCreate: true,
                subject: "",
                description: "",
                published: false
            });
        }
    }

    handleClose(option) {
        if(this.state.open) {
            console.log("Saving notification");

            const notification = {
                id: this.state.openNotification,
                truck: this.state.truck,
                media: null,
                subject: this.state.subject,
                description: this.state.description,
                type: null,
                published: option,
                postedTimestamp: this.state.postedTimestamp
            }

            axios.put(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/notifications/${this.state.openNotification}`,
                notification)
                .then(res => {
                    console.log("Notification saved!");
                    this.fetchData();
                })
                .catch(err => console.log(err.message));

            this.setState({
                openNotification: 1,
                open: false,
                openCreate: false,
                subject: "",
                description: ""
            });
        }
        else if(this.state.openCreate) {
            console.log("Creating notification");

            console.log(this.state);
            const notification = {
                id: this.state.openNotification,
                truck: this.state.truck,
                media: null,
                subject: this.state.subject,
                description: this.state.description,
                type: null,
                published: option,
                postedTimestamp: this.state.postedTimestamp
            }
            console.log(this.notification);

            axios.post(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/notifications`,
                notification)
                .then(res => {
                    console.log("Notification saved!");
                    this.fetchData();
                })
                .catch(err => console.log(err.message));

            this.setState({
                openNotification: 1,
                open: false,
                openCreate: false,
                subject: "",
                description: ""
            });
        }
    }

    handleCancel() {
        this.setState({ open: false, openCreate:false });
    }

    handleInputChange(event, opt) {
        event.preventDefault();
        console.log(event.target.value);
        console.log(opt);
        this.setState({
            [opt]: event.target.value
        });
        console.log(this.state);
    }

    handleDelete() {
        console.log(this.props.auth);
        console.log(this.state.openNotification);
        axios.delete(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/notifications/${this.state.openNotification}`,
            { auth: {
                    username: this.props.auth.email,
                    password: this.props.auth.password
                }})
            .then(r => {
                console.log("Notification deleted!");
                this.fetchData();
            })
            .catch(err => console.log(err.message));

        this.setState({
            openNotification: 1,
            open: false,
            openCreate: false,
            subject: "",
            description: ""
        });
    }

    fetchData() {
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}`)
            .then(res => {
                console.log("Found the truck!");
                this.setState({
                    truck: res.data,
                    truckName: res.data.name,
                    truckID: res.data.id
                });
                return axios.get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/notifications`)
            }).then(res2 => {
            this.setState( {
                notifications: res2.data,
                truckFound: true
            });
            console.log(this.state);
            this.fetchData();
        }).catch(err => {
            console.log(err.message);
            console.log("Cant't get notifications");
        });
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
    componentDidUpdate() {
        if(!this.state.truckFound && this.props.router.query.truck_id !== undefined) {
            this.fetchData();
        }
    }

    render() {
        return (
            <div>
                <h2>Notifications for {this.state.truckName} </h2>
                {this.state.notifications.map((n) =>
                    <Card key={n.id} variant="outlined">
                        <CardContent>
                            <CardHeader
                                title={n.subject}
                            />
                            {n.published &&
                            <CardHeader
                                subheader={format(new Date(n.postedTimestamp), "HH:mm, MM-dd-yyyy")}
                            />}
                            <Typography align="left" variant="body3" component="p">
                                {n.description}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button onClick={() => this.handleClick(n)} color="primary" variant="outlined"> Manage </Button>
                        </CardActions>
                    </Card>
                )}
                <Dialog open={this.state.open || this.state.openCreate} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Manage Notification</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Click "Publish" to publish or "Save" to save and publish later. If already published, you may only "Delete".
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="subject"
                            label="Subject"
                            type="email"
                            fullWidth={true}
                            defaultValue={this.state.subject}
                            onChange={e => this.handleInputChange(e, "subject")}
                        />
                        <InputLabel>
                        </InputLabel>
                        <TextField
                            id="description"
                            label="Description"
                            multiline
                            rows={4}
                            fullWidth={true}
                            defaultValue={this.state.description}
                            onChange={e => this.handleInputChange(e,"description")}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancel} color="primary" variant="outlined">
                            Cancel
                        </Button>
                        {!this.state.published && <Button onClick={() => this.handleClose(false)} color="primary" variant="outlined">
                            Save
                        </Button>}
                        {!this.state.published && <Button onClick={() => this.handleClose(true)} color="primary" variant="outlined">
                            Publish
                        </Button>}
                        {!this.state.published && <Button onClick={this.handleDelete} color="primary" variant="outlined">
                            Delete
                        </Button>}
                    </DialogActions>
                </Dialog>
                <Button onClick={() => this.handleClick(null)} variant="outlined"> + </Button>
                <Button href={`/owner/trucks/${this.props.router.query.truck_id}`} variant="outlined"> Back </Button>
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