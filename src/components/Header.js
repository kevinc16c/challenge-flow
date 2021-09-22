import React from 'react'
import Selector from './Selector'
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localidades: []
    }
  }
  render() {
    return (
      // <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Selector
              onSelectLocalidad={this.props.onSelectLocalidad}
            />
          </div>
        </nav>
      // </header>
    );
  }
}

export default Header;