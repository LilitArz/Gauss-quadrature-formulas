import React, { Component } from 'react'
import { getEquations } from '../util'
import { Menu } from './Menu'

export class View extends Component {
  render() {
    const equation = getEquations()
    return <Menu equations={equation} />
  }
}
