import React from "react";
import { config } from '../config';

class Clima extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: null,
      forecast: null,
      lat: 0.0,
      lon: 0.0,
      temp: 0.0,
      temp_min: 0.0,
      temp_max: 0.0,
      title: "",
    }
    this.groupResult = this.groupResult.bind(this)
  }

  async componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => this.setState({
      lat: position.coords.latitude,
      lon: position.coords.longitude
    }, () => {
      this.fetch_current();
      this.fetch_forecast();
    }),
      err => console.log(err)
    );
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (this.props.city !== "") {
        this.setState({ lat: this.props.city.lat, lon: this.props.city.lon }, () => {
          this.fetch_current();
          this.fetch_forecast();
        })
      }
    }
  }

  //Buscar tiempor en base a geolocalización
  fetch_current = async () => {
    const { lat, lon } = this.state;
    const URL = `${config.ENDPOINT_CURRENT}lat=${lat}&lon=${lon}&lang=sp&appid=${config.APP_ID}`;
    fetch(URL)
      .then(res => res.json())
      .then(
        (result) => {
          var found = config.TITULOS_CLIMA.find(item => item.d_icon_name === result.weather[0].icon || item.n_icon_name === result.weather[0].icon)
          this.setState({
            weather: result,
            temp: (result.main.temp - 273.15), //Pasa Kelvin a Celsius
            temp_min: (result.main.temp_min - 273.15),
            temp_max: (result.main.temp_max - 273.15),
            title: found.description,
            sunrise: 0,
            sunset: 0,
          });
        },
        (error) => {
          this.setState({ error });
        }
      )
  }
  fetch_forecast = async () => {
    const { lat, lon } = this.state;
    const URL = `${config.ENDPOINT_FORECAST}lat=${lat}&lon=${lon}&lang=es&cnt=&appid=${config.APP_ID}`;
    fetch(URL)
      .then(res => res.json())
      .then(
        (result) => {
          this.groupResult(result)
        },
        (error) => {
          this.setState({ error });
        }
      )
  }
  groupResult(data) {
    let tiempo = data.list, datos = []
    tiempo.forEach(item => {
      let unixTime = item.dt, date = new Date(unixTime * 1000).toLocaleDateString(), time = new Date(unixTime * 1000).toLocaleTimeString()

      datos.push({
        ...item,
        date: date,
        time: time
      })
    })
    this.setState({ forecast: datos })
  }
  render() {
    const { temp, weather, title, temp_min, temp_max, forecast } = this.state
    return (
      <div className="clima">
        {weather &&
          <div className="card" style={{ width: '100%' }}>
            <div className="card-body">
              <div className="row flex-nowrap">
                <div className="col-md-4 xs-4">
                  {new Date().toLocaleDateString()}
                  <br />
                  {weather.name}
                  <br />
                </div>
                <div className="col-md-4 xs-4">
                  <label><b>{title}</b></label>
                  <br />
                  <img className="img-responsive icono-weather-size" alt={`${weather.weather[0].icon}`} src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}></img>
                </div>
                <div className="col-md-3 xs-3">
                  {/* <label className="lbl-temp"><b>Detalles</b></label><br/> */}
                  <label className="lbl-temp">{Math.round(temp * 100) / 100} ℃</label><br />
                  <label className="lbl-det">↓ Min: {Math.round(temp_min * 100) / 100} ℃</label><br />
                  <label className="lbl-det">↑ Max: {Math.round(temp_max * 100) / 100} ℃</label><br />
                  <label className="lbl-det">Humedad: {weather.main.humidity}%</label>
                </div>
              </div>

            </div>
          </div>
        }
        <br />
        {forecast &&
          <div style={{ width: '100%' }}>
            <h4 style={{ color: 'white' }}>Pronóstico para los próximos 5 días</h4><br />
            <div className="row">
              {forecast.map(tiempo => {
                return (
                  <div className="col-md-3">
                    <div className="card" style={{ width: '100%', marginBottom:10 }}>
                      <div className="card-title">
                        {tiempo.date}
                      </div>
                      <div className="card-body">
                        <div className="row flex-nowrap">
                          <div className="col-md-12 xs-4">
                            {tiempo.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}



            </div>


          </div>
        }
      </div>
    );
  }
}

export default Clima;