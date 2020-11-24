import React from "react";
import MuiLink from '@material-ui/core/Link';

import { Card } from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating";
import Divider from "@material-ui/core/Divider";
import {format} from "date-fns";
import {makeStyles} from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles((theme) => ({
    root: {
        '&:hover': {
            cursor: "pointer"
        },
        margin: theme.spacing(3)
    },
    rating: {
        textAlign: "left",
        marginTop: "-10px",
        marginLeft: "15px"
    }
}));

function ReviewCard(props) {

    return (
        <Card className={props.className}>
            <CardContent>
                <Typography className={useStyles.root} variant="h8" component="h3" gutterBottom>
                    {format(new Date(props.r.reviewTimestamp), "MM-dd-yyyy, HH:mm")}
                </Typography>
                {props.user === false &&
                <MuiLink href={`/user/${props.r.user.id}`} className={useStyles.root}>
                    <Typography className={useStyles.root} variant="subtitle 1" component="h5" className={useStyles.root} gutterBottom>
                        By: {props.r.user.firstName} {props.r.user.lastName}
                    </Typography>
                </MuiLink>}

                {props.user === true &&
                <MuiLink href={`/trucks/${props.r.truck.id}`}>
                    <Typography className={useStyles.root} variant="subtitle 1" component="h5" className={useStyles.root} gutterBottom>
                        {props.r.truck.name}
                    </Typography>
                </MuiLink>}

                <Rating className={useStyles.rating} precision={0.5} value={props.r.rating} size="small" readOnly/>
                {props.r.comment?.split('\n').map(line => <p>{line}</p>)}
            </CardContent>
        </Card>
    );
}

export default ReviewCard;