import React from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Card, CardHeader, CardMedia, CardContent, IconButton, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Notifications, NotificationsOff } from '@material-ui/icons';

function NotificationCard(props) {

    return (
        <Card className={props.className} onClick={props.onClick}>
            <CardHeader
                title={<Link href={`/trucks/${props.truck.id}/notifications/${props.notification.id}`}>
                    {props.notification.subject}
                </Link>}
                subheader={props.notification.description}
                action={
                    <IconButton aria-label="manage">
                    </IconButton>
                }
            />
        </Card>
    );
}

export default NotificationCard;