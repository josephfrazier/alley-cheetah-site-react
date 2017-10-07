import React from 'react'
import PlacesAutocomplete from 'react-places-autocomplete'

class SimpleForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { address: '' }
    this.onChange = (address) => this.setState({ address })
    this.onFocus = () => this.setState({ focused: true })
    this.onBlur = () => this.setState({ focused: false })
  }

  render() {
    const inputProps = Object.assign({
      value: this.state.address,
      onChange: this.onChange,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      ref: 'searchInput',
    }, this.props.inputProps)

    return (
      <PlacesAutocomplete
        inputProps={inputProps}
        ref="placesAutocomplete"
        onEnterKeyDown={() => this.refs.placesAutocomplete.refs.searchInput.blur()}
        styles={{
          root: this.state.focused ? {
            position: 'fixed',
            top: '1rem',
            left: 0,
            width: '100%',
            zIndex: 1,
          } : {},

          input: {
            boxSizing: 'border-box',
            ...(this.state.focused ? {background: 'lightyellow'} : {}),
          },
        }}
      />
    )
  }
}

export default SimpleForm
