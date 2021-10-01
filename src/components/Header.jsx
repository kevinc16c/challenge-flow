import React from 'react';
import Selector from './Selector';
import './styles.scss';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localidades: []
    }
  }
  render() {
    return (
        <nav className="header">
          <div className="container-fluid">
            <Selector
              onSelectLocalidad={this.props.onSelectLocalidad}
            />
          </div>
        </nav>
    );
  }
}

export default Header;