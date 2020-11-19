import React from "react";
import Link from 'next/link';

import { Card } from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating";
import Divider from "@material-ui/core/Divider";
import {format} from "date-fns";

const styles = (theme) => ({
    review: {
        fontSize: '14 px',
        marginBottom: 10,
        margin: theme.spacing(1)
    }
})

function ReviewCard(props) {

    return (
        <Card>
            <Typography variant="h8" component="h3" gutterBottom>
                {format(new Date(props.r.reviewTimestamp), "MM-dd-yyyy, HH:mm")}
            </Typography>
            <Link href={`/user/${props.r.user.id}`}>
                <Typography variant="subtitle 1" component="h5" className={styles.review} gutterBottom>
                    By: {props.r.user.firstName} {props.r.user.lastName}
                </Typography>
            </Link>

            <Rating precision={0.5} value={props.r.rating} size="small" readOnly/>
            {props.r.comment?.split('\n').map(line => <p>{line}</p>)}
            <Divider/>
        </Card>
    );
}

export default ReviewCard;