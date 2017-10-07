import React, { Component } from 'react';

import SimpleForm from './SimpleForm.js'
import './App.css';

class App extends Component {
  rows = ['A', 'B', 'C', 'D', 'E']
  cols = [1, 2, 3, 4, 5]

  constructor (props) {
    super(props)

    // this.state = this.addGrid('', {
    //   origin: '',
    //   destination: '',
    //   babyFood1: '',
    //   babyFood2: '',
    // })
  }

  // https://farm3.static.flickr.com/2778/4134507221_d0c9ec1b7c_o.jpg
  state = {
    'origin': 'Hudson Yards Park',
    'destination': '440 Grand St',

    'A1': '221-225 8th Ave, 10011',
    'A2': '907 8th Ave, NYC',
    'A3': '289 Columbus Ave, NYC',
    'A4': '25 University Pl, NYC',
    'A5': '',

    'B1': '512 2nd Ave, NYC',
    'B2': '452 W 43rd St., NYC',
    'B3': '1407 Lexington Ave, NYC',
    'B4': '316 Greenwich St, NYC',
    'B5': '',

    'C1': '311 E 23rd St, NYC',
    'C2': '580 9th Ave, NYC',
    'C3': '2704 Broadway, NYC',
    'C4': '5 St. James Pl, NYC',
    'C5': '',

    'D1': '10 Union Sq. East, NYC',
    'D2': '225 W. 57th St, NYC',
    'D3': '609 Columbus Ave, NYC',
    'D4': '2217 7th Ave, NYC',
    'D5': '',

    'E1': '',
    'E2': '',
    'E3': '',
    'E4': '',
    'E5': '',

    'babyFood1': '441 West 26th St, NYC',
    'babyFood2': '137 East 2nd St, NYC'
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
