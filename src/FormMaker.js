import React, { Component } from 'react';
import { uuid } from './utils';
import {
  iconAdd,
  iconClose,
  iconCopy,
  iconTrash
} from './iconSVG';

export default class FormMaker extends Component {

  constructor(props) {
    super(props);
    this.activePage = <div>Your page doesn't exist yet.</div>; // show nothing
    this.state = {
      template: [
        {
          id: uuid(),
          type: 'input',
          label: '',
          value: ''
        }
      ]
    }
    /*
    // test
    this.state = {
      template: [
        {
          "id": "44a60f8a-7e79-d39e-764a-dc3eb142ec33",
          "type": "input",
          "label": "Name",
          "value": "Coba"
        },
        {
          "id": "a452f63d-6c20-3b24-3a28-7ba1a8e9312f",
          "type": "dropdown",
          "label": "National",
          "value": [
            "Indonesia",
            "Singapore"
          ]
        },
        {
          "id": "5d250b59-44b2-1031-d5bc-8580400de1fb",
          "type": "radioboxes",
          "label": "Gender",
          "value": [
            "L",
            "P"
          ]
        },
        {
          "id": "11594810-7f82-2444-3932-e8b9c8983617",
          "type": "checkboxes",
          "label": "Hobi",
          "value": [
            "football",
            "makan",
            "tidur"
          ]
        },
        {
          "id": "fc61be1e-ee89-2fb8-6755-dd4788f0f3ef",
          "type": "paragraph",
          "label": "Alamat",
          "value": "Isi alamat"
        }
      ]
    }*/
  }

  componentWillUpdate(nextProps, nextState) {
    let { pageActive } = nextProps;
    let { template } = nextState;

    this.switchPage(pageActive);

    this.edit();
  }

  componentWillMount() {
    let { pageActive } = this.props;
    this.switchPage(pageActive);
  }

  handleNewField(event, type = 'input') {
    event.preventDefault();

    let props = {
      label: '',
      value: ''
    }

    this.create(type, props);

  }

  handleDeleteField(event) {
    event.preventDefault();
    let { template } = this.state;
    let targetID = event.target.getAttribute('data-target');

    let index = template.findIndex(obj => obj.id === targetID);

    if (template.length <= 1) {
      alert('Cannot delete last field.');
      return false;
    }

    template.splice(index, 1);
    this.setState({
      template
    });

    return false;
  }

  handleTypeField({ target }) {
    let { template } = this.state;
    let type = target.value;
    let id = target.getAttribute('data-target');

    let index = template.findIndex((obj) => obj.id === id);
    template[index].value = [''];
    template[index].type = type;

    this.setState({
      template
    })

    return false;
  }

  handleCopyField(event) {
    event.preventDefault();
    let { target } = event;
    let { template } = this.state;
    let id = target.getAttribute('data-target');

    let index = template.findIndex((obj) => obj.id === id);
    let type = template[index].type;
    let thisTemplate = template[index];
    let value = [];

    if (typeof thisTemplate.value === 'object') {
      thisTemplate.value.forEach((val) => {
        value.push(val);
      });
    } else {
      value.push(thisTemplate.value);
    }

    let props = {
      value,
      label: thisTemplate.label
    }

    this.create(type, props);

    return false;
  }

  handleOnInputChange({ target }, type) {
    let { template } = this.state;

    let id = target.getAttribute('data-target');

    let index = template.findIndex((obj) => obj.id === id);
    template[index].value = target.value;

    this.setState({
      template
    });

    return false;
  }

  handleOptionOnChange({ target }) {
    let { template } = this.state;

    let optId = target.getAttribute('data-opt');
    let id = target.getAttribute('data-target');

    let index = template.findIndex((obj) => obj.id === id);

    template[index].value[optId] = target.value;

    this.setState({
      template
    });

    return false;
  }

  handleAddMoreOption(event) {
    event.preventDefault();
    let { target } = event;
    let { template } = this.state;
    let id = target.getAttribute('data-target');

    let index = template.findIndex((obj) => obj.id === id);

    template[index].value.push('');

    this.setState({
      template
    });

    return false;
  }

  handleDeleteMoreOption(event) {
    event.preventDefault();
    let { target } = event;
    let { template } = this.state;
    let id = target.getAttribute('data-target');
    let optId = target.getAttribute('data-opt');

    let index = template.findIndex((obj) => obj.id === id);

    if (template[index].value.length <= 1) {
      return alert('Cannot delete single option');
    }

    template[index].value.splice(optId, 1);

    this.setState({
      template
    });

    return false;
  }


  handleLabelChanged({ target }) {
    let { template } = this.state;
    let id = target.getAttribute('data-target');

    let index = template.findIndex((obj) => obj.id === id);

    template[index].label = target.value;

    this.setState({
      template
    });

    return false;
  }

  makeListOption(props, type) {
    let { id, value } = props;

    if ( typeof value !== 'object' ) return false;

    let jsxFields = value.map((val, i) => {
      let field = '';
      switch(type) {
        case 'dropdown':
          val = val || `Dropdown ${ i + 1 }` ;
          field = <input type="text" data-target={ id } data-opt={ i.toString() } onBlur={ this.handleOptionOnChange.bind(this) } className="editable-dropdown" defaultValue={ val }/>
          break;
        case 'radioboxes':
          val = val || `Radio ${ i + 1 }` ;
          field = (
            <div>
              <input type="radio" disabled/>
              <input type="text" data-target={ id } data-opt={ i.toString() } onBlur={ this.handleOptionOnChange.bind(this) } className="editable-radioboxes" defaultValue={ val }/>
            </div>
          )
          break;
        case 'checkboxes':
          val = val || `Checkbox ${ i + 1 }` ;
          field = (
            <div>
              <input type="checkbox" checked="true" disabled/>
              <input type="text" data-target={ id } data-opt={ i.toString() } onBlur={ this.handleOptionOnChange.bind(this) } className="editable-checkboxes" defaultValue={ val }/>
            </div>
          )
          break;
      }

      return (
        <tr key={ `${type}-${ i }-${ uuid() }` }>
          <td>
            { i + 1 }.
          </td>
          <td>
            { field }
          </td>
          <td>
            <ul className="option-action">
              <li className="add-option">
                <a href="#" onClick={ this.handleAddMoreOption.bind(this) } data-target={ id }>
                  { iconAdd }
                </a>
              </li>
              <li className="delete-option">
                <a href="#" onClick={ this.handleDeleteMoreOption.bind(this) } data-target={ id } data-opt={ i }>
                  { iconClose }
                </a>
              </li>
            </ul>
          </td>
        </tr>
      )
    });

    return (
      <div>
        <table>
          <tbody>
            { jsxFields }
          </tbody>
       </table>
      </div>
    )
  }

  switchPage(page) {
    switch(page) {
      case 'edit':
        this.activePage = this.edit();
        break;
      case 'preview':
        this.activePage = this.preview();
        break;
      case 'json':
        this.activePage = this.json();
        break;
      default:
        // Keep default value
        break;
    }
  }

  create(type = 'input', props = '') {
    let { template } = this.state;

    if (typeof type === 'object') type = 'input';

    let newTemplate = {
      id: uuid(),
      type: type,
      label: props.label || '',
      value: props.value || ''
    };

   template.push(newTemplate)

    this.setState({
      template
    });

    return false;
  }

  edit() {
    let { template } = this.state;
    let jsxTemplate = template.map((obj) => {
      return this.renderEditFields(obj);
    });
    return (
      <div className="edit-container">
        { jsxTemplate }
      </div>
    )
  }

  renderEditFields(props) {
    let { id, type, label, value } = props;
    let content = '';

    switch(type) {
      case 'input':
        value = value || '';
        content = (
          <div className="edit-element edit-input">
            <input type="text" data-target={ id } onChange={ this.handleOnInputChange.bind(this) } className="editable-input" defaultValue={ value }/>
          </div>
        );
        break;

      case 'dropdown':
        content = (
          <div className="edit-element optionable edit-dropdown">
            { this.makeListOption(props, type) }
          </div>
        );
        break;

      case 'radioboxes':
        content = (
          <div className="edit-element optionable edit-radioboxes">
            { this.makeListOption(props, type) }
          </div>
        );
        break;
      case 'checkboxes':
        content = (
          <div className="edit-element optionable edit-checkboxes">
            { this.makeListOption(props, type) }
          </div>
        );
        break;
      case 'paragraph':
        value = value || '';
        content = (
          <div className="edit-element edit-paragraph">
            <textarea data-target={ id } onChange={ this.handleOnInputChange.bind(this) } defaultValue={ value }></textarea>
          </div>
        );
        break;
    }

    let generateFieldKey = (value) => {
      if (type === value) {
        return { key: `field-type--${ value }`}
      }
    }

    return (
      <div className="edit-lists" key={ `edit-list--${ id }` }>
        <div className="edit-top">
          <div className="edit-label">
            <input type="text" onChange={ this.handleLabelChanged.bind(this) } data-target={ id } className="text-label" defaultValue={ label || 'Example label' }/>
          </div>
          <div className="edit-type">
            <select name="change-type-field" data-target={ id } onChange={ this.handleTypeField.bind(this) } value={ type.toLowerCase() }>
              <option { ...generateFieldKey('input') } value="input">Input</option>
              <option { ...generateFieldKey('dropdown') } value="dropdown">Dropdown</option>
              <option { ...generateFieldKey('radioboxes') } value="radioboxes">Radio Boxes</option>
              <option { ...generateFieldKey('checkboxes') } value="checkboxes">Checkboxes</option>
              <option { ...generateFieldKey('paragraph') } value="paragraph">Paragraph</option>
            </select>
          </div>
        </div>
        <div className="edit-center">
          <div className="edit-content">
            { content }
          </div>
          <div className="edit-action">
            <ul className="edit-action-menu">
              <li className="copy-field">
                <a href="#" onClick={ this.handleCopyField.bind(this) } data-target={ id }>
                  { iconCopy }
                </a>
              </li>
              <li className="delete-field">
                <a href="#" onClick={ this.handleDeleteField.bind(this) } data-target={ id }>
                  { iconTrash }
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="edit-bottom">
          <button className="btn btn-new-field" onClick={ this.handleNewField.bind(this) }>
            { iconAdd }
          </button>
        </div>
      </div>
    )
  }

  renderPreview(template) {
    return template.map((obj, i) => {
      let { id, value, type, label } = obj;
      let content = '';
      switch(type){
        case 'input':
          content = <input type="text" defaultValue={ value } className="preview-input"/>
          break;
        case 'dropdown':
          content = () => {
            let options = value.map((val, i) => {
              val = val || `Dropdown ${ i + 1 }`;

              return (
                <option key={ `dropdown-opt-${ id }-${ val }` }>{ val }</option>
              )
            })

            return (
              <select>
                { options }
              </select>
            );
          }
          break;
        case 'radioboxes':
          content = value.map((val, i) => {
            let idEl = `radioboxes-opt-${ id }-${ i }`;
            val = val || `Radio ${ i + 1 }`;
            return (
              <span key={ idEl }>
                <input type="radio" id={ idEl } name={ id }/>
                <label htmlFor={ idEl }>{ val }</label>
              </span>
            )
          });
          break;
        case 'checkboxes':
          content = value.map((val, i) => {
            let idEl = `checkboxes-opt-${ id }-${ i }`;
            val = val || `Checkbox ${ i + 1 }`;
            return (
              <span key={ idEl }>
                <input type="checkbox" id={ idEl } name={ id }/>
                <label htmlFor={ idEl }>{ val }</label>
              </span>
            )
          });
          break;
        case 'paragraph':
          content = <textarea className="preview-paragraph" defaultValue={value}></textarea>
          break;
      }

      label = label || "Example label";
      return (
        <tr key={ `preview-${ obj.id }` }>
          <td className>
            { label }
          </td>
          <td>
            { typeof content === 'function' ? content() : content }
          </td>
        </tr>
      );
    });
  }

  preview() {
    let { template } = this.state;
    return (
      <div className="preview-container">
        <table>
          <tbody>
            { this.renderPreview(template) }
          </tbody>
        </table>
      </div>
    )
  }

  json() {
    let { template } = this.state;
    return (
      <div className="json-container">
        <textarea defaultValue={ JSON.stringify(template, undefined, 2) }></textarea>
      </div>
    )
  }

  render() {
    return this.activePage;
  }
}

FormMaker.defaultProps = {
  pageActive: 'edit'
}