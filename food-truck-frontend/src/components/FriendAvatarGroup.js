import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import FriendAvatar from './FriendAvatar';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        '& > *': {
            margin: '0 5px',
        },
    },
}));

function FriendAvatarGroup(props) {
    const classes = useStyles();

    const { children } = props;
    const childCount = React.Children.count(children);
    const childArray = _.take(React.Children.toArray(children), props.max - (childCount > props.max ? 1 : 0));
    if (childCount > props.max) {
        childArray.push(<FriendAvatar name={`+${childCount - (props.max - 1)}`} url={props.extraURL} />);
    }

    return (
        <div className={classes.root} style={props.style}>
            {childArray}
        </div>
    );
}

FriendAvatarGroup.propTypes = {
    style: PropTypes.any,
    children: PropTypes.array,
    max: PropTypes.number.isRequired,
    extraURL: PropTypes.string.isRequired,
};

export default FriendAvatarGroup;
