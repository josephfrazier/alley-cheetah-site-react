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
    'babyFood2': '137 East 2nd St, NYC',

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
    const waypointOptions = undefined
    const memoizeFn = undefined
    const key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

    self.setState({loading: true})
    fetch('/api', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({origin, destination, waypointGrid, waypointOptions, babyFoodStops, memoizeFn, key})
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
