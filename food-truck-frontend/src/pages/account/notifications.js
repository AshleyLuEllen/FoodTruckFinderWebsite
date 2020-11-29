/* eslint-disable indent */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';
import requests from '../../util/requests';
import { logout as authLogout } from '../../redux/actions/auth';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import { Dialog, DialogActions, DialogTitle, DialogContent, Button } from '@material-ui/core';
import { AttachFile as AttachmentIcon, Email as UnreadIcon, DraftsOutlined as ReadIcon } from '@material-ui/icons';
import ReactMarkdown from 'react-markdown';
import EnhancedTable from '../../components/tables/EnhancedTable';

// eslint-disable-next-line no-unused-vars
const notificationStyles = theme => ({
    root: {
        width: '100%',
        padding: '20px',
    },
});
class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            selected: [],
            userId: undefined,
            open: false,
        };

        this.markAllAsUnread = this.markAllAsUnread.bind(this);
        this.markAllAsRead = this.markAllAsRead.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.viewNotification = this.viewNotification.bind(this);
    }

    markAllAsRead() {
        Promise.all(
            this.state.selected
                .map(id => this.state.rows.find(row => row.id === id))
                .map(not => {
                    requests.patchWithAuth(
                        `${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userId}/notifications/${not.id}`,
                        {
                            unread: false,
                        },
                        this.props.auth
                    );
                })
        )
            .then(this.fetchData)
            .catch(err => console.log(err));
    }

    markAllAsUnread() {
        Promise.all(
            this.state.selected
                .map(id => this.state.rows.find(row => row.id == id))
                .filter(not => not !== undefined)
                .map(not => {
                    requests.patchWithAuth(
                        `${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userId}/notifications/${not.id}`,
                        {
                            unread: true,
                        },
                        this.props.auth
                    );
                })
        )
            .then(this.fetchData)
            .catch(err => console.log(err));
    }

    fetchData() {
        requests
            .getWithAuth(`${process.env.FOOD_TRUCK_API_URL}/users/me`, this.props.auth)
            .then(res => {
                this.setState({
                    userId: res.data.id,
                });
                return requests.getWithAuth(
                    `${process.env.FOOD_TRUCK_API_URL}/users/${res.data.id}/notifications`,
                    this.props.auth
                );
            })
            .then(res => {
                this.setState(
                    {
                        rows: res.data.map(not => ({
                            unread: not.unread,
                            truck_name: not.truck?.name || '',
                            subject: not.subject,
                            date: parseISO(not.postedTimestamp),
                            id: not.id,
                            description: not.description,
                            media: not.media,
                        })),
                    },
                    () => console.table(this.state.rows)
                );
            })
            .catch(err => console.log(err));
    }

    componentDidMount() {
        this.fetchData();
    }

    handleClose() {
        this.setState({
            open: false,
            // selectedNotification: undefined
        });
    }

    viewNotification(_event, id) {
        this.setState({
            open: true,
            selectedNotification: this.state.rows.find(row => row.id == id),
        });

        requests
            .patchWithAuth(
                `${process.env.FOOD_TRUCK_API_URL}/users/${this.state.userId}/notifications/${id}`,
                {
                    unread: false,
                },
                this.props.auth
            )
            .then(() => {
                const i = this.state.rows.findIndex(row => row.id === id);
                this.setState({
                    rows: [
                        ...this.state.rows.slice(0, i),
                        {
                            ...this.state.rows[i],
                            unread: false,
                        },
                        ...this.state.rows.slice(i + 1),
                    ],
                });
            })
            .catch(err => console.log(err));
    }

    render() {
        const { classes } = this.props;

        const columns = [
            {
                id: 'unread',
                align: 'left',
                width: '50px',
                disablePadding: false,
                label: 'Unread',
                renderer: val => (val ? <UnreadIcon /> : <ReadIcon />),
            },
            {
                id: 'truck_name',
                align: 'left',
                width: '250px',
                disablePadding: false,
                label: 'Food Truck',
            },
            {
                id: 'subject',
                align: 'left',
                width: '450px',
                disablePadding: false,
                label: 'Subject',
            },
            {
                id: 'date',
                align: 'right',
                width: '200px',
                disablePadding: false,
                label: 'Posted',
                renderer: val => format(val, 'Pp'),
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

        const rowActions = [{ references: 'id', color: 'primary', label: 'View', action: this.viewNotification }];

        const selectedActions = [
            { title: 'Mark All as Read', icon: <ReadIcon />, action: () => console.log('mark all as read') },
            { title: 'Mark All as Unread', icon: <UnreadIcon />, action: () => console.log('mark all as unread') },
        ];

        const unselectedActions = [];

        return (
            <div className={classes.root}>
                <EnhancedTable
                    columns={columns}
                    rowActions={rowActions}
                    selectedActions={selectedActions}
                    unselectedActions={unselectedActions}
                    title="Notifications"
                    rows={this.state.rows}
                    order="desc"
                    orderBy="date"
                    onSelectionChange={data => {
                        console.log(data);
                        this.setState({ selected: data });
                    }}
                />
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    scroll="paper"
                    aria-labelledby="dialog-title"
                    aria-describedby="dialog-description"
                >
                    <DialogTitle id="dialog-title">
                        {this.state.selectedNotification?.subject}
                        {this.state.selectedNotification?.truck_name &&
                            ` - ${this.state.selectedNotification?.truck_name}`}
                    </DialogTitle>
                    <DialogContent dividers>
                        {/* eslint-disable-next-line react/no-children-prop */}
                        <ReactMarkdown children={this.state.selectedNotification?.description || ''} />
                        {this.state.selectedNotification?.media && (
                            <img src={this.state.selectedNotification?.media.url} />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

Notifications.propTypes = {
    auth: PropTypes.any,
    classes: PropTypes.any,
};

function mapStateToProps(state) {
    const { auth } = state;
    return { auth };
}

const mapDispatchToProps = {
    authLogout,
};

export default withStyles(notificationStyles, { withTheme: true })(
    connect(mapStateToProps, mapDispatchToProps)(Notifications)
);
