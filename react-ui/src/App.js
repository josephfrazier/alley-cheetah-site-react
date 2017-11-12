import React, { Component } from 'react';
import persist from 'react-localstorage-hoc'

import SimpleForm from './SimpleForm.js'
import './App.css';
import manifest from './manifest.jpg'

class App extends Component {
  rows = ['A', 'B', 'C', 'D', 'E']
  cols = [1, 2, 3, 4, 5]

  constructor (props) {
    super(props)

    this.state = this.setValues('', this.demoState)
  }

  clearForm () {
    this.setState(this.setValues('', this.demoState))
  }

  // https://farm3.static.flickr.com/2778/4134507221_d0c9ec1b7c_o.jpg
  demoState = {
    'origin': 'Mott Haven Bar & Grill, The Bronx',
    'destination': 'Mott Haven Bar & Grill, The Bronx',

    'A1': '301 Morris Ave, The Bronx',
    'A2': '1136 Ogden Ave, The Bronx',
    'A3': '3690 Third Ave, The Bronx',
    'A4': '2385 Arther Ave, The Bronx',
    'A5': '1654 Metropolitan Ave, The Bronx',

    'B1': '2733 Third Ave, The Bronx',
    'B2': '156 W 170th St, The Bronx',
    'B3': '548 St Pauls Pl, The Bronx',
    'B4': '668 Crescent Ave, The Bronx',
    'B5': '1489 West Ave, The Bronx',

    'C1': '436 Brook Ave, The Bronx',
    'C2': '1339 Jerome Ave, The Bronx',
    'C3': '1472 Boston Rd, The Bronx',
    'C4': '2285 Grand Concourse, The Bronx',
    'C5': '2079 Benedict Ave, The Bronx',

    'D1': "256 St Ann's Ave",
    'D2': '1384 Nelson Ave, The Bronx',
    'D3': '630 East 169th Street, The Bronx',
    'D4': '309 E Burnside Ave, The Bronx',
    'D5': '1630 Bruckner Blvd, The Bronx',

    'E1': '459 E 149th St, The Bronx',
    'E2': '1150 Woodycrest Ave, The Bronx',
    'E3': '1041 Prospect Ave, The Bronx',
    'E4': '2044 Webster Ave, The Bronx',
    'E5': '831 Rosedale Ave, The Bronx',

    'babyFood1': '1384 Stratford Ave, The Bronx',
    'babyFood2': '',

    'loading': false,
    'responseBody': [],
  }

  setValues (value, obj) {
    return Object.keys(obj).reduce((result, key) => ({...result, [ key ]: value}), {})
  }

  render() {
    return (
      <div className="App">
        <h1>Alley Cheetah</h1>

        <p>
          Alley Cheetah helps you be the fastest cat of your local <a href="http://cranksgiving.org">Cranksgiving</a>.
        </p>

        <p>
          Fill in the form below, or <button onClick={() => this.setState(this.demoState)}>use demo values</button> from this <a href={manifest}>manifest</a>.
        </p>

        <p>
          You can also <button onClick={() => this.clearForm()}>clear the form</button>.
        </p>

        <form
          style={{
            padding: '1rem'
          }}
        >
          <fieldset>
            <legend>Origin/Destination:</legend>

            <SimpleForm
              inputProps={{
                value: this.state.origin,
                onChange: address => this.setState({ origin: address }),
                placeholder: 'Origin'
              }}
            />

            <br />

            <SimpleForm
              inputProps={{
                value: this.state.destination,
                onChange: address => this.setState({ destination: address }),
                placeholder: 'Destination'
              }}
            />
          </fieldset>

          <fieldset>
            <legend>Waypoints:</legend>

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
          </fieldset>

          <fieldset>
            <legend>Baby Food Drop-off Points (intermediate stops that can't be the first stop):</legend>

            {
              [1, 2].map(n => (
                <div
                  key={n}
                  style={{
                    marginBottom: '1rem'
                  }}
                >
                  <SimpleForm
                    inputProps={{
                      value: this.state['babyFood' + n],
                      onChange: address => this.setState({ ['babyFood' + n]: address }),
                      placeholder: 'Baby Food Stop ' + n
                    }}
                  />
                </div>
              ))
            }
          </fieldset>

          {
            this.state.loading ? (
              <p>Loading</p>
            ) : this.state.responseBody ? (
              <ul
                style={{
                  listStyle: 'none'
                }}
              >
                {
                  this.state.responseBody.map(({link, description, routeSortKey, humanizedDistance, humanizedDuration}, i) => (
                    <li key={link + routeSortKey}>
                      <a href={link}>
                        {description} {routeSortKey} ({humanizedDistance}, {humanizedDuration})
                      </a>
                    </li>
                  ))
                }
              </ul>
            ) : ''
          }

          <button
            type='button'
            onClick={() => this.onSubmit(this)}
            style={{
              height: '3rem',
              width: '100%'
            }}
          >
            Submit
          </button>
        </form>
      </div>
    );
  }

  onSubmit (self) {
    const {origin, destination} = self.state

    const waypointGrid = removeEmptyCells(self.rows.map(row =>
      self.cols.map(col =>
        self.state[row + col]
      )
    ))

    const babyFoodStops = removeEmptyItems([self.state.babyFood1, self.state.babyFood2])

    self.setState({loading: true})
    fetch('/api', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({origin, destination, waypointGrid, babyFoodStops})
    }).then(response => response.json()).then(({responseBody}) => {
      self.setState({responseBody, loading: false})
    })
  }
}

function removeEmptyCells (grid) {
  return removeEmptyItems(grid.map(row => removeEmptyItems(row)))
}

function removeEmptyItems (list) {
  return list.filter(item => item.length)
}

export default persist(App);
