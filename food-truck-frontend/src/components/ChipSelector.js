import React, { useState, useEffect } from "react";

import { makeStyles } from '@material-ui/core/styles';
import { Checkbox, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import { CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon, CheckBox as CheckBoxIcon } from '@material-ui/icons';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const useStyles = makeStyles((theme) => ({
    chipArray: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
      },
      chip: {
        margin: theme.spacing(0.5),
      }
}));

const getOptionLabel = option => option.name;

function ChipSelector(props) {
    const classes = useStyles();

    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        if (props.selectedOptions) {
            setSelectedOptions(props.selectedOptions);
        }
    }, [props.selectedOptions]);

    return (
        <div className={classes.root}> 
            <Autocomplete
                multiple
                value={selectedOptions}
                id="chip-selector"
                options={props.options}
                disableCloseOnSelect
                getOptionLabel={props.getOptionLabel || getOptionLabel}
                renderOption={(option, { selected }) => (
                    <React.Fragment>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8}}
                            checked={selected}
                        />
                        {props.getOptionLabel ? props.getOptionLabel(option) : getOptionLabel(option)}
                    </React.Fragment>
                )}
                style={{ width: "100%" }}
                renderInput={(params) => (
                    <TextField {...params} variant="outlined" label={props.label}/> 
                )}
                onChange={(event, newSelectedOptions) => {
                    // Deselect
                    if (newSelectedOptions.length < selectedOptions.length) {
                        if (props.onDeselectOption) {
                            props.onDeselectOption(selectedOptions.filter(x => !newSelectedOptions.includes(x))[0], newSelectedOptions);
                        }
                    }

                    // Select
                    if (newSelectedOptions.length > selectedOptions.length) {
                        if (props.onSelectOption) {
                            props.onSelectOption(newSelectedOptions.filter(x => !selectedOptions.includes(x))[0], newSelectedOptions);
                        }
                    }

                    if (props.onChange) {
                        props.onChange(event, newSelectedOptions);
                    }
                    
                    setSelectedOptions(newSelectedOptions);
                }}
            />
        </div>
    );
}

export default ChipSelector;