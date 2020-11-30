import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    root: {
        '&:hover': {
            cursor: 'pointer',
        },
    },
}));

function FriendAvatar(props) {
    const classes = useStyles();

    return (
        <Link href={props.url || `/user/${props.user.id}`}>
            <Avatar
                className={classes.root + ` ${props.className || ''}`}
                alt={props.name ? undefined : `${props.user.firstName} ${props.user.lastName}`}
                src={props.user.avatar?.url}
            >
                {props.name || `${props.user.firstName.charAt(0)}${props.user.lastName.charAt(0)}`}
            </Avatar>
        </Link>
    );
}

FriendAvatar.propTypes = {
    url: PropTypes.string,
    user: PropTypes.any.isRequired,
    name: PropTypes.string,
    className: PropTypes.any,
};

export default FriendAvatar;
