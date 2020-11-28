import React, { Component } from 'react';
import PropTypes from 'prop-types';
import requests from '../../../../util/requests';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import { format } from 'date-fns';

import {
    Card,
    CardHeader,
    TextField,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Dialog,
    Button,
    CardContent,
    CardActions,
    Typography,
} from '@material-ui/core';

/**
 * Information page for the food trucks which includes an editing form if you're the
 * authenticated owner
 */
class NotificationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            truck: '',
            truckName: '',
            truckID: 1,
            notifications: [],
            truckFound: false,

            openNotification: 1,
            openNotObj: undefined,
            open: false,
            openCreate: false,
            subject: '',
            description: '',
            published: false,
            postedTimestamp: null,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

    handleClick(notification) {
        if (notification !== null) {
            this.setState({
                openNotification: notification.id,
                openNotObj: { ...notification },
                open: true,
                subject: notification.subject,
                description: notification.description,
                published: notification.published,
                postedTimestamp: notification.postedTimestamp,
            });
        } else {
            this.setState({
                openNotification: undefined,
                openNotObj: undefined,
                openCreate: true,
                subject: '',
                description: '',
                published: false,
            });
        }
    }

    handleMediaUpload(notId) {
        if (!this.state.media) {
            return Promise.resolve(0);
        }

        const formData = new FormData();
        formData.append('file', this.state.media);

        return requests
            .putWithAuth(`${process.env.FOOD_TRUCK_API_URL}/notifications/${notId}/media`, formData, this.props.auth, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(() => {
                console.log('Success');
                this.setState({ media: undefined });
            });
        // .catch(err => {
        //     console.log(err);
        // });
    }

    handleClose(option) {
        if (this.state.open) {
            console.log('Saving notification');

            const notification = {
                id: this.state.openNotification,
                truck: this.state.truck,
                media: null,
                subject: this.state.subject,
                description: this.state.description,
                type: null,
                published: option,
                postedTimestamp: this.state.postedTimestamp,
            };

            requests
                .put(
                    `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/notifications/${this.state.openNotification}`,
                    notification
                )
                .then(res => {
                    console.log('Notification saved!');
                    console.log(res);
                    return this.handleMediaUpload(res.data.id);
                })
                .then(() => {
                    this.fetchData();
                    this.setState({
                        openNotification: undefined,
                        open: false,
                        openCreate: false,
                        subject: '',
                        description: '',
                    });
                })
                .catch(err => console.log(err.message));
        } else if (this.state.openCreate) {
            console.log('Creating notification');

            console.log(this.state);
            const notification = {
                id: this.state.openNotification,
                truck: this.state.truck,
                media: null,
                subject: this.state.subject,
                description: this.state.description,
                type: null,
                published: option,
                postedTimestamp: this.state.postedTimestamp,
                notificationType: null,
            };

            requests
                .post(
                    `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/notifications`,
                    notification
                )
                .then(res => {
                    console.log('Notification saved!');
                    console.log(res);
                    return this.handleMediaUpload(res.data.id);
                })
                .then(() => {
                    console.log('Notification saved!');
                    this.fetchData();
                    this.setState({
                        openNotification: undefined,
                        open: false,
                        openCreate: false,
                        subject: '',
                        description: '',
                    });
                })
                .catch(err => console.log(err.message));
        }
    }

    handleCancel() {
        this.setState({ open: false, openCreate: false });
    }

    handleInputChange(event, opt) {
        event.preventDefault();
        console.log(event.target.value);
        console.log(opt);
        this.setState({
            [opt]: event.target.value,
        });
        console.log(this.state);
    }

    handleDelete() {
        console.log(this.props.auth);
        console.log(this.state.openNotification);
        requests
            .deleteWithAuth(
                `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/notifications/${this.state.openNotification}`,
                this.props.auth
            )
            .then(() => {
                console.log('Notification deleted!');
                this.fetchData();
            })
            .catch(err => console.log(err.message));

        this.setState({
            openNotification: 1,
            open: false,
            openCreate: false,
            subject: '',
            description: '',
        });
    }

    fetchData() {
        requests
            .get(`${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}`)
            .then(res => {
                console.log('Found the truck!');
                this.setState({
                    truck: res.data,
                    truckName: res.data.name,
                    truckID: res.data.id,
                });
                return requests.get(
                    `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/notifications`
                );
            })
            .then(res2 => {
                this.setState({
                    notifications: res2.data,
                    truckFound: true,
                });
                console.log(this.state);
            })
            .catch(err => {
                console.log(err.message);
                // eslint-disable-next-line quotes
                console.log("Cant't get notifications");
            });
    }

    /**
     * Continuously updates the truck information on the page
     */
    componentDidUpdate() {
        if (!this.state.truckFound && this.props.router.query.truck_id !== undefined) {
            this.fetchData();
        }
    }

    render() {
        return (
            <div>
                <h2>Notifications for {this.state.truckName} </h2>
                {this.state.notifications.map(n => (
                    <Card key={n.id} variant="outlined">
                        <CardContent>
                            <CardHeader title={n.subject} />
                            {n.published && (
                                <CardHeader subheader={format(new Date(n.postedTimestamp), 'HH:mm, MM-dd-yyyy')} />
                            )}
                            <Typography align="left" variant="body2" component="p">
                                {n.description}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button onClick={() => this.handleClick(n)} color="primary" variant="contained">
                                {' '}
                                Manage{' '}
                            </Button>
                        </CardActions>
                    </Card>
                ))}
                <Dialog open={this.state.open || this.state.openCreate} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Manage Notification</DialogTitle>
                    <DialogContent>
                        {!this.state.published && (
                            <DialogContentText>
                                Click &quot;Publish&quot; to publish or &quot;Save&quot; to save and publish later. If
                                already published, you may only &quot;Delete&quot;.
                            </DialogContentText>
                        )}
                        <TextField
                            autoFocus
                            margin="dense"
                            id="subject"
                            label="Subject"
                            variant="outlined"
                            fullWidth={true}
                            disabled={this.state.published}
                            defaultValue={this.state.subject}
                            onChange={e => this.handleInputChange(e, 'subject')}
                        />
                        <TextField
                            id="description"
                            label="Description"
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth={true}
                            disabled={this.state.published}
                            defaultValue={this.state.description}
                            onChange={e => this.handleInputChange(e, 'description')}
                        />
                        {!this.state.published && (
                            <div>
                                <Button variant="contained" component="label" style={{ width: 'auto', height: 'auto' }}>
                                    Upload Media
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        ref={this.mediaInputRef}
                                        accept="image/jpeg,image/png,image/gif"
                                        onChange={e => this.setState({ media: e.target.files[0] })}
                                    />
                                </Button>
                                {this.state.media && `Selected file: ${this.state.media.name}`}
                            </div>
                        )}
                        {this.state.openNotObj?.media && <img src={this.state.openNotObj.media.url}></img>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancel} color="primary" variant="contained">
                            Cancel
                        </Button>
                        {!this.state.published && (
                            <Button onClick={() => this.handleClose(false)} color="primary" variant="contained">
                                Save
                            </Button>
                        )}
                        {!this.state.published && (
                            <Button onClick={() => this.handleClose(true)} color="primary" variant="contained">
                                Publish
                            </Button>
                        )}
                        {!this.state.published && !this.state.openCreate && (
                            <Button onClick={this.handleDelete} color="secondary" variant="contained">
                                Delete
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
                <Button onClick={() => this.handleClick(null)} variant="contained">
                    {' '}
                    +{' '}
                </Button>
                <Button href={`/owner/trucks/${this.props.router.query.truck_id}`} variant="contained">
                    {' '}
                    Back{' '}
                </Button>
            </div>
        );
    }
}

NotificationPage.propTypes = {
    router: PropTypes.any,
    auth: PropTypes.any,
};

const mapStateToProps = state => {
    const { auth } = state;
    return { auth };
};

const mapDispatchToProps = {};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NotificationPage));
