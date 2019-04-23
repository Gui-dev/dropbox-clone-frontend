import React, { Component } from 'react'
import { MdInsertDriveFile } from 'react-icons/md'
import { distanceInWords } from 'date-fns'
import pt from 'date-fns/locale/pt'
import Dropzone from 'react-dropzone'
import socket from 'socket.io-client'

import api from './../../services/api.js'
import logo from './../../assets/images/logo.svg'
import './style.css'

export default class Box extends Component {

  state = {
    box: {}
  }

  async componentDidMount() {

    this.subscribeToNewFiles()

    const { id } = this.props.match.params
    const response = await api.get( `/boxes/${id}` )

    this.setState( { box: response.data } )
  }

  handleUpload = ( files ) => {

    files.forEach( file => {
      const data = new FormData()
      const { id } = this.props.match.params

      data.append( 'file', file )
      api.post( `/boxes/${id}/files`, data )
    } )
  }

  subscribeToNewFiles = () => {

    const { id } = this.props.match.params 
    const io = socket( 'https://dropboxclonebackend.herokuapp.com' )

    io.emit( 'connectRoom', id )
    io.on( 'file', data => {
      this.setState( { box: { ...this.state.box, files: [ data, ...this.state.box.files ] } } )
    } )
  }

  render() {

    const { box } = this.state

    return (

      <div id="box-container">
        <header>
          <img src={ logo } alt="[Dropbox Logo]" title="Dropbox Logo"/>
          <h1>{ box.title }</h1>
        </header>

        <Dropzone onDropAccepted={ this.handleUpload }>
          { ( { getRootProps, getInputProps } ) => (
            <div className="upload" { ...getRootProps() }>
              <input { ...getInputProps() }/>
              <p>Arraste arquivos ou clique aqui</p>
            </div>
          ) }
        </Dropzone>

        <ul>

          { box.files && box.files.map( file => (
            <li key={ file._id }>
              <a className="fileInfo" 
                href={ file.url } target="_blank"
                rel="noopener noreferrer"
              >
                <MdInsertDriveFile size={24} color="#A5CFFF" />
                <strong>{ file.title }</strong>
              </a>
              <span>há{ ' ' } 
                { 
                  distanceInWords( file.createdAt, new Date(), {
                    locale: pt
                  } ) 
                
                }
              </span>
            </li>
          ) ) }

        </ul>

      </div>
    )
  }
}