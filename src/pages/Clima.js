import React from "react";
import { config } from '../config';

const ENDPOINT = 'http://api.openweathermap.org/data/2.5/weather?'

class Clima extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localidades: [],
      lat: 0.0,
      lon: 0.0,
      temp: 0.0,
    }
  }

  async componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => this.setState({
      lat: position.coords.latitude,
      lon: position.coords.longitude
    }, () => {
      this.fetch();
    }),
      err => console.log(err)
    );
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (this.props.city !== "") {
        this.setState({lat: this.props.city.lat, lon: this.props.city.lon}, ()=>{
          this.fetch();
        })
      }
    }
  }

  //Buscar tiempor en base a geolocalización
  fetch = async () => {
    const {lat,lon} = this.state;
    const URL = `${ENDPOINT}lat=${lat}&lon=${lon}&appid=${config.APP_ID}`;
    fetch(URL)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            weather: result,
            temp: (result.main.temp - 273.15) //Pasa Kelvin a Celsius
          });
        },
        (error) => {
          this.setState({ error });
        }
      )
  }
  render() {
    const {temp} = this.state
    return (
      <div className="clima">
        {this.state.weather &&
          <div>
            Clima en {this.state.weather.name}
            <br />
            {new Date().toLocaleString()}
            <br />
            {Math.round(temp * 100) / 100} ℃
          </div>
        }
      </div>
    );
  }
}

export default Clima;