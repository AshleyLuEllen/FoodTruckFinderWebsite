import { combineReducers } from 'redux';
import { reducer as authReducer } from './auth';

export default combineReducers({
    // Add your reducers here
    auth: authReducer,
});
