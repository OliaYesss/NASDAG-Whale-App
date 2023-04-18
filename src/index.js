import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store'
// import { fetchNasdagIndx } from './utils/fetchNasdagIndx';
// import { addNasdagIndx } from './features/nasdag/nasdagSlice';

// fetchNasdagIndx()
//     .then(response => {
//       store.dispatch(addNasdagIndx({
//         nasdagIndx: response.pagination.limit
//       }))
//     })

ReactDOM.render(
  // <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>,
  // </React.StrictMode>,
  document.getElementById('root')
);