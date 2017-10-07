import React, { Component } from 'react';

import SimpleForm from './SimpleForm.js'
import './App.css';

class App extends Component {
  rows = ['A', 'B', 'C', 'D', 'E']
  cols = [1, 2, 3, 4, 5]

  constructor (props) {
    super(props)

    this.state = this.addGrid('', {
      origin: '',
      destination: '',
      babyFood1: '',
      babyFood2: '',
    })
  }

  addGrid (value, result) {
    return this.rows.reduce((result, row) => {
      return this.cols.reduce((result, col) => {
        result[row + col] = ''
        return result
      }, result)
    }, result)
  }

  render() {
    return (
      <div className="App">
        <SimpleForm
          inputProps={{
            value: this.state.origin,
            onChange: address => this.setState({ origin: address }),
            placeholder: 'Origin'
          }}
        />

        <SimpleForm
          inputProps={{
            value: this.state.destination,
            onChange: address => this.setState({ destination: address }),
            placeholder: 'Destination'
          }}
        />

        <table
          style={{
            width: '100%'
          }}
        >
          <thead>
            <tr>
              {
                ['', ...this.cols].map(col => (
                  <th key={col}>{col}</th>
                ))
              }
            </tr>
          </thead>

          <tbody>
            {
              this.rows.map(row => (
                <tr key={row}>
                  <th>{row}</th>
                  {
                    this.cols.map(col => (
                      <td key={col}>
                        <SimpleForm
                          inputProps={{
                            value: this.state[row + col],
                            onChange: address => this.setState({ [row + col]: address }),
                            placeholder: row + col
                          }}
                        />
                      </td>
                    ))
                  }
                </tr>
              ))
            }
          </tbody>
        </table>

        {
          [1, 2].map(n => (
            <SimpleForm
              key={n}
              inputProps={{
                value: this.state['babyFood' + n],
                onChange: address => this.setState({ ['babyFood' + n]: address }),
                placeholder: 'Baby Food Stop ' + n
              }}
            />
          ))
        }
      </div>
    );
  }
}

export default App;
