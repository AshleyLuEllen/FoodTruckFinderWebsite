import React from 'react';
import MuiLink from '@material-ui/core/Link';
import PropTypes from 'prop-types';

import { Card } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { format, parseISO } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles(() => ({
    root: {
        spacing: '10px',
    },
}));

function ReviewCard(props) {
    const classes = useStyles();

    return (
        <Card className={props.className}>
            <CardContent className={classes.root}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Rating className={classes.rating} precision={0.5} value={props.r.rating} size="large" readOnly />
                    <strong>{format(parseISO(props.r.reviewTimestamp), 'Pp')}</strong>
                </div>
                {props.user === false && (
                    <div style={{ textAlign: 'right' }}>
                        <MuiLink href={`/user/${props.r.user.id}`}>
                            {props.r.user.firstName} {props.r.user.lastName}
                        </MuiLink>
                    </div>
                )}

                {props.user === true && <MuiLink href={`/trucks/${props.r.truck.id}`}>{props.r.truck.name}</MuiLink>}

                {props.r.comment.trim().length > 0 &&
                    props.r.comment?.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </CardContent>
        </Card>
    );
}

ReviewCard.propTypes = {
    r: PropTypes.object.isRequired,
    className: PropTypes.string,
    user: PropTypes.any,
};

export default ReviewCard;
