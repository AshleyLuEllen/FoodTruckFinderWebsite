import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { logout as authLogout } from '../redux/actions/auth';

import Link from 'next/link';
import {
    Link as MuiLink,
    AppBar,
    Toolbar,
    Tooltip,
    IconButton,
    Button,
    Typography,
    InputBase,
    Badge,
    Menu,
    MenuItem,
} from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import {
    Search as SearchIcon,
    AccountCircle,
    Notifications as NotificationsIcon,
    Pageview as PageviewIcon,
} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
        textDecoration: 'none',
        transition: '0.2s all',
        '&:hover': {
            // textDecoration: "underline",
            fontSize: '1.5rem',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchButton: {
        width: 'auto',
        height: 'auto',
        transition: '0.3s all',
        '&.hidden': {
            width: 0,
        },
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    sectionDesktop: {
        display: 'flex',
    },
    loginButton: {
        marginLeft: theme.spacing(2),
        height: 'auto',
        width: '100px',
    },
    link: {
        '&:hover': {
            textDecoration: 'none',
        },
    },
}));

function Header(props) {
    const router = useRouter();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [notificationCount, setNotificationCount] = React.useState(0);
    const [transferToMaintenancePage, setTransferToMaintenancePage] = React.useState(false);

    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        // handleMobileMenuClose();
    };

    const handleTrySearch = e => {
        if (e.keyCode == 13) {
            console.log('query', e.target.value);
            if (event.target.value.length > 0) {
                router.push({
                    pathname: '/search',
                    query: { query: e.target.value },
                });
            }
        }
    };

    React.useEffect(() => {
        axios
            .get(`${process.env.FOOD_TRUCK_API_URL}/users/me`, {
                auth: {
                    username: props.auth.email,
                    password: props.auth.password,
                },
            })
            .then(res => {
                return axios.get(`${process.env.FOOD_TRUCK_API_URL}/users/${res.data.id}/notifications/unread`, {
                    auth: {
                        username: props.auth.email,
                        password: props.auth.password,
                    },
                });
            })
            .then(res => {
                console.log(res.data);
                setNotificationCount(res.data.length);
            })
            .catch(err => {
                if (
                    err.includes &&
                    err.includes('Network Error') &&
                    !err.response?.status &&
                    !router.asPath.startsWith('/maintenance')
                ) {
                    setTransferToMaintenancePage(true);
                } else if (err.response.status == 401) {
                    props.authLogout();
                }
            });
    }, []);

    React.useEffect(() => {
        if (transferToMaintenancePage && !router.asPath.includes('[') && !router.asPath.includes('maintenance')) {
            router.push({
                pathname: '/maintenance',
                query: {
                    next: router.asPath,
                },
            });
        }
    }, [transferToMaintenancePage, router.asPath]);

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MuiLink className={classes.link} href="/owner/trucks" color="inherit">
                <MenuItem onClick={handleMenuClose}>My Trucks</MenuItem>
            </MuiLink>
            <MuiLink className={classes.link} href="/account" color="inherit">
                <MenuItem onClick={handleMenuClose}>My Profile</MenuItem>
            </MuiLink>
            <MuiLink className={classes.link} href="/logout" color="inherit">
                <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </MuiLink>
        </Menu>
    );

    return (
        <div className={classes.grow}>
            <AppBar position="static">
                <Toolbar>
                    <Link href="/" passHref>
                        <Typography component="a" className={classes.title} variant="h6" noWrap color="inherit">
                            Food Truck Finder
                        </Typography>
                    </Link>
                    <div className={classes.grow} />
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            onKeyDown={handleTrySearch}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                    <Tooltip title="Search">
                        <IconButton style={{ color: 'white' }} onClick={() => router.push('/search')}>
                            <PageviewIcon />
                        </IconButton>
                    </Tooltip>
                    {props.auth.isLoggedIn && (
                        <div className={classes.sectionDesktop}>
                            <IconButton
                                aria-label={`show ${notificationCount} new notifications`}
                                color="inherit"
                                href="/account/notifications"
                            >
                                {notificationCount > 0 ? (
                                    <Badge badgeContent={notificationCount} color="secondary">
                                        <NotificationsIcon />
                                    </Badge>
                                ) : (
                                    <NotificationsIcon />
                                )}
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                        </div>
                    )}
                    {!props.auth.isLoggedIn && (
                        <Button href="/login" variant="contained" className={classes.loginButton}>
                            Login
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
            {renderMenu}
        </div>
    );
}
Header.propTypes = {
    auth: PropTypes.any,
    coords: PropTypes.any,
    isGeolocationEnabled: PropTypes.any,
    isGeolocationAvailable: PropTypes.any,
    classes: PropTypes.any,
    authLogout: PropTypes.any,
};

function mapStateToProps(state) {
    const { auth } = state;
    return { auth };
}

const mapDispatchToProps = {
    authLogout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
