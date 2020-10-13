import React from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import _ from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import FriendAvatar from './FriendAvatar';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        '& > *': {
            margin: "0 5px"
        }
    }
}));

function FriendAvatarGroup(props) {
    const classes = useStyles();

    const { children } = props;
    const childCount = React.Children.count(children);
    const childArray = _.take(React.Children.toArray(children), props.max - (childCount > props.max ? 1 : 0));
    if (childCount > props.max) {
        childArray.push(<FriendAvatar name={`+${childCount - (props.max - 1)}`} url={props.extraURL}/>)
    }

    return (
        <div className={classes.root}>
            {childArray}
        </div>
    );
}

export default FriendAvatarGroup;