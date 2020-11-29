import React from 'react';
import PropTypes from 'prop-types';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';

import { TextField, Typography, Grid } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { LocationOn as LocationOnIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

function loadScript(src, position, id) {
    if (!position) {
        return;
    }

    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('id', id);
    script.src = src;
    position.appendChild(script);
}

const autocompleteService = { current: null };

const useStyles = makeStyles(theme => ({
    icon: {
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(2),
    },
}));

export default function LocationInput(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState('');
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);
    const loaded = React.useRef(false);

    if (typeof window !== 'undefined' && !loaded.current) {
        if (!document.querySelector('#google-maps')) {
            loadScript(
                `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&libraries=places`,
                document.querySelector('head'),
                'google-maps'
            );
        }

        loaded.current = true;
    }

    const fetch = React.useMemo(
        () =>
            throttle((request, callback) => {
                try {
                    autocompleteService.current.getPlacePredictions(request, callback);
                } catch (e) {
                    console.error('Problem getting autocomplete recommendations: ', e);
                }
            }, 200),
        []
    );

    React.useEffect(() => {
        let active = true;

        if (!autocompleteService.current && window.google) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
        }
        if (!autocompleteService.current) {
            return undefined;
        }

        if (inputValue === '') {
            setOptions(value ? [value] : []);
            return undefined;
        }

        fetch({ input: inputValue }, results => {
            if (active) {
                let newOptions = [];

                if (value) {
                    newOptions = [value];
                }

                if (results) {
                    newOptions = [...newOptions, ...results];
                }

                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch]);

    React.useEffect(() => {
        if (props.initialValue) {
            setInputValue(props.initialValue);
            setValue(props.initialValue);
        }
    }, [props.initialValue]);

    return (
        <Autocomplete
            id="google-map-demo"
            style={{ width: '100%' }}
            getOptionLabel={option => (typeof option === 'string' ? option : option.description)}
            filterOptions={x => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            onChange={(event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
                if (props.onChange) {
                    props.onChange(event, newValue);
                }
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={params => (
                <TextField
                    {...params}
                    label="Location"
                    variant="outlined"
                    required={props.required ? true : false}
                    fullWidth
                    error={props.required && !value}
                />
            )}
            renderOption={option => {
                const matches = option.structured_formatting.main_text_matched_substrings;
                const parts = parse(
                    option.structured_formatting.main_text,
                    matches.map(match => [match.offset, match.offset + match.length])
                );

                return (
                    <Grid container alignItems="center">
                        <Grid item>
                            <LocationOnIcon className={classes.icon} />
                        </Grid>
                        <Grid item xs>
                            {parts.map((part, index) => (
                                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                                    {part.text}
                                </span>
                            ))}

                            <Typography variant="body2" color="textSecondary">
                                {option.structured_formatting.secondary_text}
                            </Typography>
                        </Grid>
                    </Grid>
                );
            }}
        />
    );
}

LocationInput.propTypes = {
    onChange: PropTypes.func,
    initialValue: PropTypes.any,
    required: PropTypes.bool,
};
