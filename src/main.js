import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Load style file
import './style.scss';

import FormWrapper from './FormWrapper';

class App extends Component {
 
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FormWrapper/>
    )
  }

}

ReactDOM.render(<App/>, document.querySelector('#app'));