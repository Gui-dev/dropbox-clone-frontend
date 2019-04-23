import React, { Component } from 'react'

import api from './../../services/api'

import logo from './../../assets/images/logo.svg'
import './style.css'

export default class Main extends Component {

  state = {
    newBox: ''
  }

  handleSubmit = async ( event ) => {

    event.preventDefault()
    const response = await api.post( '/boxes', {
      title: this.state.newBox
    } )

    this.props.history.push( `/box/${response.data._id}` )
  }

  handleInputChange = ( event ) => {

    const newBox = event.target.value
    this.setState( { newBox } )
  }

  render() {

    return (

      <div id="main-container">
        <form onSubmit={ this.handleSubmit }>
          <img src={ logo } alt="[Logotipo]" title="Logotipo"/>
          <input type="text"
            placeholder="Criar um box"
            value={ this.state.newBox }
            onChange={ this.handleInputChange }
          />
          <button type="submit">Criar</button>
        </form>
      </div>
    )
  }
}