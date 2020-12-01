import React, { Component } from 'react';
import PropTypes from 'prop-types';
import requests from '../../../../util/requests';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

import {
    TextField,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Dialog,
    Button,
    CircularProgress,
    Typography,
    Container,
    Snackbar,
    Link as MuiLink,
    Breadcrumbs,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';
import Head from 'next/dist/next-server/lib/head';
import EnhancedTable from '../../../../components/tables/EnhancedTable';
import { AttachFile as AttachmentIcon, Add as AddIcon } from '@material-ui/icons';
import ReactMarkdown from 'react-markdown';

// eslint-disable-next-line no-unused-vars
const pageStyles = () => ({
    root: {
        marginTop: '20px',
    },
    textField: {
        marginBottom: '20px',
    },
});

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
            isLoading: false,

            openNotification: 1,
            openNotObj: undefined,
            open: false,
            openCreate: false,
            subject: '',
            description: '',
            published: false,
            postedTimestamp: null,

            errorMsg: '',
            errorOpen: false,
            errorSeverity: 'error',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleClick = this.editNotification.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

    editNotification(notification) {
        if (notification !== null) {
            this.setState({
                openNotification: notification.id,
                openNotObj: { ...notification },
                open: true,
                subject: notification.subject,
                description: notification.description,
                published: notification.published,
                postedTimestamp: notification.postedTimestamp,
                media: undefined,
            });
        } else {
            this.setState({
                openNotification: undefined,
                openNotObj: undefined,
                openCreate: true,
                subject: '',
                description: '',
                published: false,
                media: undefined,
            });
        }
    }

    handleMediaUpload(notId) {
        if (!this.state.media) {
            return Promise.resolve(0);
        }

        const formData = new FormData();
        formData.append('file', this.state.media);

        return requests.putWithAuth(
            `${process.env.FOOD_TRUCK_API_URL}/notifications/${notId}/media`,
            formData,
            this.props.auth,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
    }

    async handleClose(option) {
        this.setState({
            subject: this.state.subject.trim(),
            description: this.state.description.trim(),
        });

        try {
            if (this.state.open) {
                const notification = {
                    subject: this.state.subject,
                    description: this.state.description,
                    published: option,
                };

                try {
                    await this.handleMediaUpload(this.state.openNotification).then(() => {
                        this.setState({
                            errorMsg: 'Notification media uploaded.',
                            errorOpen: true,
                            errorSeverity: 'info',
                            media: undefined,
                        });
                    });
                } catch (err) {
                    console.error(err);
                    this.setState({
                        errorMsg: 'Error: could not upload the media! Check the console for more information.',
                        errorOpen: true,
                        updating: false,
                    });
                    return;
                }

                await requests
                    .patchWithAuth(
                        `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/notifications/${this.state.openNotification}`,
                        notification,
                        this.props.auth
                    )
                    .then(() => this.setState({ errorMsg: 'Notification saved successfully.' }));
            } else if (this.state.openCreate) {
                const notification = {
                    subject: this.state.subject,
                    description: this.state.description,
                    published: option,
                };

                let notId;

                await requests
                    .postWithAuth(
                        `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/notifications`,
                        notification,
                        this.props.auth
                    )
                    .then(res => {
                        notId = res.data.id;
                        this.setState({ errorMsg: 'Notification created successfully.' });
                    });

                try {
                    await this.handleMediaUpload(notId);
                } catch (err) {
                    console.error(err);
                    this.setState({
                        errorMsg: 'Error: could not upload the media! Check the console for more information.',
                        errorOpen: true,
                        updating: false,
                        open: true,
                        openCreate: false,
                        openNotification: notId,
                    });
                    return;
                }
            }
        } catch (err) {
            console.error(err);
            this.setState({
                errorMsg: 'Error: could not save your notification! Check the console for more information.',
                errorOpen: true,
                updating: false,
            });
            return;
        }

        this.setState({
            // errorMsg: 'Notification saved successfully.',
            errorOpen: true,
            errorSeverity: 'success',
            open: false,
            openCreate: false,
        });

        this.fetchData();
    }

    handleCancel() {
        this.setState({ open: false, openCreate: false });
    }

    handleInputChange(event, opt) {
        event.preventDefault();
        this.setState({
            [opt]: event.target.value,
        });
    }

    async handleDelete() {
        try {
            await requests.deleteWithAuth(
                `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/notifications/${this.state.openNotification}`,
                this.props.auth
            );
        } catch (err) {
            console.error(err);
            this.setState({
                errorMsg: 'Error: could not save your notification! Check the console for more information.',
                errorOpen: true,
            });
            return;
        }

        this.setState({
            errorMsg: 'Notification draft deleted successfully.',
            errorOpen: true,
            errorSeverity: 'success',
            open: false,
            openCreate: false,
        });
        this.fetchData();
    }

    fetchData() {
        requests
            .getWithAuth(
                `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}`,
                this.props.auth
            )
            .then(res => {
                this.setState({
                    truck: res.data,
                    truckName: res.data.name,
                    truckID: res.data.id,
                });
                return requests.getWithAuth(
                    `${process.env.FOOD_TRUCK_API_URL}/trucks/${this.props.router.query.truck_id}/notifications`,
                    this.props.auth
                );
            })
            .then(res2 => {
                this.setState({
                    notifications: res2.data.map(not => ({
                        not,
                        id: not.id,
                        subject: not.subject,
                        // date: parseISO(not.postedTimestamp),
                        date: not.published ? not.postedTimestamp && parseISO(not.postedTimestamp) : undefined,
                        media: not.media !== undefined && not.media !== null,
                    })),
                    truckFound: true,
                    isLoading: false,
                });
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errorMsg:
                        'Error: could not fetch truck information! Check the console for more information. Try again later.',
                    errorOpen: true,
                });
                return;
            });
    }

    componentDidMount() {
        this.setState({
            isLoading: false,
            truckFound: false,
        });
    }

    /**
     * Continuously updates the truck information on the page
     */
    componentDidUpdate() {
        if (!this.state.truckFound && this.props.router.query.truck_id !== undefined && !this.state.isLoading) {
            this.setState({
                isLoading: true,
            });
            this.fetchData();
        }
    }

    render() {
        const { classes } = this.props;

        const columns = [
            {
                id: 'subject',
                align: 'left',
                width: '600px',
                disablePadding: false,
                label: 'Subject',
            },
            {
                id: 'date',
                align: 'right',
                width: '200px',
                disablePadding: false,
                label: 'Posted',
                renderer: val => (val ? format(val, 'Pp') : <span style={{ color: 'red' }}>Not yet posted.</span>),
            },
            {
                id: 'media',
                align: 'right',
                width: '50px',
                disablePadding: false,
                label: '',
                renderer: val => val && <AttachmentIcon />,
            },
        ];

        const rowActions = [
            {
                references: 'not',
                color: 'primary',
                label: 'Manage',
                action: (event, not) => this.editNotification(not),
            },
        ];

        const unselectedActions = [
            { title: 'Create new notification', icon: <AddIcon />, action: () => this.editNotification(null) },
        ];

        return (
            <Container className={classes.root}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link href="/owner/trucks" passHref>
                        <MuiLink color="inherit">My Trucks</MuiLink>
                    </Link>
                    {this.props.router?.query?.truck_id ? (
                        <Link href={`/owner/trucks/${this.props.router.query.truck_id}`} passHref>
                            <MuiLink color="inherit">Manage Truck</MuiLink>
                        </Link>
                    ) : (
                        <Typography color="textPrimary">Truck</Typography>
                    )}
                    <Typography color="textPrimary">Notifications</Typography>
                </Breadcrumbs>
                <Head>
                    <title>{this.state.truckName} Notifications</title>
                </Head>
                <EnhancedTable
                    disableSelection
                    columns={columns}
                    rowActions={rowActions}
                    unselectedActions={unselectedActions}
                    title={<span>Notifications {this.state.isLoading && <CircularProgress size={24} />}</span>}
                    rows={this.state.notifications}
                    order="desc"
                    orderBy="date"
                    onSelectionChange={data => {
                        this.setState({ selected: data });
                    }}
                />
                <Dialog open={this.state.open || this.state.openCreate} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Manage Notification</DialogTitle>
                    <DialogContent>
                        {!this.state.published && (
                            <DialogContentText>
                                Click &quot;Publish&quot; to publish or &quot;Save&quot; to save and publish later. When
                                published, you may not &quot;Delete&quot; the notification.
                            </DialogContentText>
                        )}
                        <TextField
                            className={classes.textField}
                            autoFocus
                            id="subject"
                            label="Subject"
                            variant="outlined"
                            fullWidth={true}
                            disabled={this.state.published}
                            value={this.state.subject}
                            onChange={e => this.handleInputChange(e, 'subject')}
                            onBlur={() => this.setState({ subject: this.state.subject.trim() })}
                        />
                        <TextField
                            id="description"
                            label="Description"
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth={true}
                            disabled={this.state.published}
                            value={this.state.description}
                            onChange={e => this.handleInputChange(e, 'description')}
                            onBlur={() => this.setState({ description: this.state.description.trim() })}
                        />
                        <ReactMarkdown>
                            The truck description supports **Markdown**! Learn more about it
                            [here](https://commonmark.org/help/).
                        </ReactMarkdown>
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
                                </Button>{' '}
                                {this.state.media && `Selected file: ${this.state.media.name}`}
                            </div>
                        )}
                        {this.state.openNotObj?.media && (
                            <img style={{ width: '100%' }} src={this.state.openNotObj.media.url}></img>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancel} color="primary" variant="contained">
                            {this.state.published ? 'Close' : 'Cancel'}
                        </Button>
                        {!this.state.published && (
                            <Button
                                onClick={() => this.handleClose(false)}
                                color="primary"
                                variant="contained"
                                disabled={this.state.subject.length < 3 || this.state.description.length < 3}
                            >
                                Save
                            </Button>
                        )}
                        {!this.state.published && (
                            <Button
                                onClick={() => this.handleClose(true)}
                                color="primary"
                                variant="contained"
                                disabled={this.state.subject.length < 3 || this.state.description.length < 3}
                            >
                                Publish
                            </Button>
                        )}
                        {!this.state.published && !this.state.openCreate && this.state.open && (
                            <Button onClick={this.handleDelete} color="secondary" variant="contained">
                                Delete
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
                <Snackbar
                    open={this.state.errorOpen}
                    autoHideDuration={5000}
                    onClose={(_event, reason) => {
                        if (reason === 'clickaway') {
                            return;
                        }

                        this.setState({
                            errorOpen: false,
                        });
                    }}
                    onExited={() => this.setState({ errorSeverity: 'error' })}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        variant="filled"
                        severity={this.state.errorSeverity}
                        onClose={() => {
                            this.setState({
                                errorOpen: false,
                            });
                        }}
                    >
                        {this.state.errorMsg}
                    </Alert>
                </Snackbar>
            </Container>
        );
    }
}

NotificationPage.propTypes = {
    router: PropTypes.any,
    auth: PropTypes.any,
    classes: PropTypes.any,
};

const mapStateToProps = state => {
    const { auth } = state;
    return { auth };
};

const mapDispatchToProps = {};

export default withStyles(pageStyles, { withTheme: true })(
    withRouter(connect(mapStateToProps, mapDispatchToProps)(NotificationPage))
);
