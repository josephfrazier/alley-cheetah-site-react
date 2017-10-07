import React, { Component } from 'react';

import SimpleForm from './SimpleForm.js'
import './App.css';

class App extends Component {
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
                ['', 1, 2, 3, 4, 5].map(col => (
                  <th key={col}>{col}</th>
                ))
              }
            </tr>
          </thead>

          <tbody>
            {
              ['A', 'B', 'C', 'D', 'E'].map(row => (
                <tr key={row}>
                  <th>{row}</th>
                  {
                    [1, 2, 3, 4, 5].map(col => (
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
