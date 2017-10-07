import React from 'react'
import PlacesAutocomplete from 'react-places-autocomplete'

class SimpleForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.onChange = (address) => this.setState({ address })
  }

  render() {
    const inputProps = Object.assign({}, this.props.inputProps, {
      value: this.state.address,
      onChange: this.onChange,
    })

    return (
      <PlacesAutocomplete
        inputProps={inputProps}
        styles={{
          autocompleteContainer: {
            zIndex: 1
          }
        }}
      />
    )
  }
}

export default SimpleForm
