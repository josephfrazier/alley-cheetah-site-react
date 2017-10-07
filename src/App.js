import React, { Component } from 'react';

import SimpleForm from './SimpleForm.js'
import './App.css';

class App extends Component {
  rows = ['A', 'B', 'C', 'D', 'E']
  cols = [1, 2, 3, 4, 5]

  render() {
    return (
      <div className="App">
        <SimpleForm
          inputProps={{
            placeholder: 'Origin'
          }}
        />

        <SimpleForm
          inputProps={{
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
