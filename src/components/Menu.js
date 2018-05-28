import React, { Component } from 'react'
import {
  Mapper,
  getDegrees,
  matchEquation,
  findRoots,
  getCoefficient
} from '../util'

const styles = {
  landingEditorHeading: {
    width: '80%',
    margin: '0 auto',
    border: '1px solid gray',
    WebkitBoxShadow: '0px 2px 15px 0px rgba(0, 0, 0, 0.75)',
    boxShadow: '0px 2px 15px 0px rgba(0, 0, 0, 0.75)',
    padding: 20,
    bordeRadius: 15,
    position: 'relative',
    top: 50
  },
  editorToolsHeadingWrap: {
    borderBottom: '1px solid #b3b3b3',
    paddingBottom: 10
  },
  editorToolsHeading: {
    width: '50%',
    display: '-webkit-box',
    display: '-ms-flexbox',
    display: 'flex'
  },
  editToolUrl: {
    textAlign: 'center',
    width: '45%'
  },
  editToolId: {
    textAlign: 'center',
    width: '26%'
  },
  landingEditor: {
    display: '-webkit-box',
    display: '-ms-flexbox',
    display: 'flex',
    height: 50
  },
  editorTools: {
    width: '50%',
    textAlign: 'center',
    display: '-webkit-box',
    display: '-ms-flexbox',
    display: 'flex',
    msFlexPack: 'distribute',
    justifyContent: 'spaceAround',
    WebkitBoxAlign: 'center',
    msFlexAlign: 'center',
    alignItems: 'center'
  },
  landingUrl: {
    width: '20%'
  }
}

export class Menu extends Component {
  menuRenderer = () => {
    return (
      <div>
        <div style={styles.landingEditorHeading}>
          <div style={styles.editorToolsHeadingWrap}>
            <div style={styles.editorToolsHeading}>
              <div>n</div>
              <div style={styles.editToolId}>Equations</div>
              <div style={styles.editToolUrl}>Roots</div>
              <div style={styles.editToolUrl}>gorcakic</div>
            </div>
          </div>
          <Mapper
            data={this.props.equations}
            render={(item, index) => {
              return (
                <div style={styles.landingEditor} key={index}>
                  <div style={styles.editorTools}>
                    <div>{index}</div>
                    <div style={styles.landingUrl}>
                      {matchEquation(getDegrees(item.degrees), item.coef)}
                    </div>
                    <div style={styles.landingId}>
                      {findRoots(getDegrees(item.degrees), item.coef)}
                    </div>
                    <Mapper
                      data={findRoots(getDegrees(item.degrees), item.coef)}
                      render={(elem, i) => {
                        return (
                          <div style={styles.landingId} key={i}>
                            {getCoefficient(
                              findRoots(getDegrees(item.degrees), item.coef),
                              i
                            )}
                          </div>
                        )
                      }}
                    />
                  </div>
                </div>
              )
            }}
          />
        </div>
      </div>
    )
  }

  render() {
    return this.menuRenderer()
  }
}
