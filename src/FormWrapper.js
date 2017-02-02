import React, { Component } from 'react';
import FormMaker from './FormMaker';
import {
  iconEdit,
  iconEye,
  iconCircle,
  iconBookList
} from './iconSVG';


export default class extends Component {
  
  constructor(props) {
    super(props);
    this.navigation = [
      {
        icon: iconEdit,
        text: 'Edit'
      },
      {
        icon: iconEye,
        text: 'Preview'
      },
      {
        icon: iconCircle,
        text: 'Json'
      }
    ];

    this.state = {
      pageActive: this.navigation[0].text.toLowerCase() 
    }
  }
  
  componentWillUpdate(nextProps, nextState) {
    let { pageActive } = nextState;
    let nextDataPage = document.querySelector(`[data-page=${ pageActive }]`);
    this.removeNavListClass();
    nextDataPage.classList.add('active');
  }
  
  removeNavListClass(className = 'active') {
    document.querySelectorAll('ul.nav-menu li').forEach((obj) => {
      obj.classList.remove(className);
    });
  }
  
  handleNavClick(event) {
    let href = event.target.getAttribute('href').split('#')[1];

    this.setState({
      pageActive: href
    });
  }

  makeNavigation(active = this.navigation[0].text) {
    let list = this.navigation.map( ({ icon, text }, i) => {
      return (
        <li key={ `nav-${ i }` } data-page={ text.toLowerCase() } className={ text.toLowerCase() === active.toLowerCase() ? 'active' : '' }>
          <i className="icon svg">
            { icon }
          </i>
          <a onClick={ this.handleNavClick.bind(this) } href={ `#${ text.toLowerCase() }` }>
            { text }
          </a>
        </li>
      )
    })

    return (
      <ul className="nav-menu">
        { list }
      </ul>
    )
  }

  render() {
    let { pageActive } = this.state;
    return (
      <div className="form-wrapper">
        <div className="title">
          <h1>
            <i className="icon svg">
              { iconBookList }
            </i>
            Djava Web Form Generator
          </h1>
        </div>
        <div className="navigator">
          { this.makeNavigation("edit") }
        </div>
        <div className="content">
          <FormMaker pageActive={ pageActive }/>
        </div>
      </div>
    )
  }
  
}