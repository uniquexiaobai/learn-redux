import { createStore, combineReducers, applyMiddleware } from 'redux';

function counter(state = 0, action) {
    switch (action.type) {
        case 'inc':
            return state + 1;
        case 'dec':
            return state - 1;
        default:
            return state;
    }
}

const reducers = combineReducers({ counter });

const logger = store => next => action => {
    console.log('### dispatch start', action);
    let result = next(action);
    console.log('### dispatch end');
    return result;
};

const thunk = ({dispatch, getState}) => next => action => {
    if (typeof action === 'function') {
        return action(dispatch, getState);
    }
    return next(action);
}

const store = createStore(
    reducers,
    applyMiddleware(thunk, logger),
);

store.subscribe(() => console.log(store.getState()));

store.dispatch({ type: 'inc' });
store.dispatch({ type: 'dec' });

store.dispatch({ type: 'inc' });
setTimeout(() => {
    store.dispatch({ type: 'dec' });
}, 1000);

store.dispatch((dispatch) => {
    dispatch({ type: 'inc' });
    setTimeout(() => {
        dispatch({ type: 'dec' });
    }, 1000);
});