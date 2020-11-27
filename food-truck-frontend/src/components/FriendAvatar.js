import React from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        '&:hover': {
            cursor: "pointer"
        }
    }
}));

function FriendAvatar(props) {
    const classes = useStyles();
    const router = useRouter();

    return (
        <Link href={props.url || `/user/${props.user.id}`}>
            <Avatar
                className={classes.root + ` ${props.className || ''}`}
                alt={props.name ? undefined : `${props.user.firstName} ${props.user.lastName}`}
                src="/static/images/avatar/1.jpg" 
            >{props.name || `${props.user.firstName.charAt(0)}${props.user.lastName.charAt(0)}`}</Avatar>
        </Link>
    );
}

export default FriendAvatar;