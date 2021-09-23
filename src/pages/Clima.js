import React from "react";
import { config } from '../config';
import { utils } from "../utils";

class Clima extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: null,
      forecast: null,
      lat: 0.0,
      lon: 0.0,
      metric: "",
      temp: 0,
      feels_like: 0,
      temp_min: 0,
      temp_max: 0,
      title: "",
      units: 'metric'
    }
    this.prepareResult = this.prepareResult.bind(this);
    this.changeUnits = this.changeUnits.bind(this);
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
    const { lat, lon, units } = this.state;
    const URL = `${config.ENDPOINT_CURRENT}lat=${lat}&lon=${lon}&units=${units}&appid=${config.APP_ID}`;
    fetch(URL)
      .then(res => res.json())
      .then(
        (result) => {

          this.setState({
            weather: result,
            temp: result.main.temp,
            feels_like: result.main.feels_like,
            title: utils.capitalizeFirstLetter(result.weather[0].description),
          });
        },
        (error) => {
          this.setState({ error });
        }
      )
  }
  fetch_forecast = async () => {
    const { lat, lon, units } = this.state;
    const URL = `${config.ENDPOINT_FORECAST}lat=${lat}&lon=${lon}&units=${units}&appid=${config.APP_ID}`;
    fetch(URL)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result)
          this.prepareResult(result)
        },
        (error) => {
          this.setState({ error });
        }
      )
  }
  prepareResult(data) {
    let daily = data.daily, datos = [], date = ""
    daily.forEach((item, index) => {
      date = utils.unixToDate(item.dt);
      if (index === 0) {
        this.setState({
          temp_max: item.temp.max,
          temp_min: item.temp.min,
        })
      }
      date = utils.capitalizeFirstLetter(date)
      if (index > 0 && index < 6) {
        datos.push({
          ...item,
          date: date,
        })
      }
    })
    console.log(datos)
    this.setState({ forecast: datos })
  }
  changeUnits(unit) {
    if (unit === "C") {
      return this.setState({ units: 'metric' }, () => {
        this.fetch_current();
        this.fetch_forecast();
      })
    } else {
      return this.setState({ units: 'imperial' }, () => {
        this.fetch_current();
        this.fetch_forecast();
      })
    }
  }

  render() {
    const { weather, title, temp_min, temp_max, forecast, temp, feels_like, units } = this.state;
    return (
      <div className="clima">
        <div className="col-sm-12 md-12 xs-12" style={{ marginBottom: 'auto' }}>
          {weather &&
            <div style={{ width: '100%' }}>

              <h4 style={{ color: 'white' }}>Pronóstico actual</h4><br />
              <div className="card" style={{ width: '100%' }}>

                <div className="card-body">
                  <div className="row flex-nowrap">
                    <div className="col-md-3 xs-4">
                      {new Date().toLocaleDateString()}
                      <br />
                      {weather.name}
                      <br />
                      <button className="btn btn-outline-dark refresh-button">
                        Mi ciudad
                      </button>
                    </div>
                    <div className="col-md-3 xs-4">
                      <label><b>{title}</b></label>
                      <br />
                      <img className="img-responsive icono-weather-size" alt={`${weather.weather[0].icon}`} src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}></img>
                    </div>
                    <div className="col-md-4 xs-3">
                      {/* <label className="lbl-temp"><b>Detalles</b></label><br/> */}
                      <label className="lbl-temp">{Math.round(temp)}
                        <button
                          type="link"
                          className="link-button-metric"
                          style={{ color: units === 'metric' ? 'black' : '#0000008a' }}
                          onClick={() => this.changeUnits("C")}>
                          ℃
                        </button>
                        |
                        <button
                          type="link"
                          className="link-button-metric"
                          style={{ color: units === 'imperial' ? 'black' : '#0000008a' }}
                          onClick={() => this.changeUnits("F")}>
                          ℉
                        </button>
                      </label><br />
                      <label className="lbl-det">Sensación térmica: {Math.round(feels_like)} ℃</label><br />
                      <label className="lbl-det"> ↓ Min: {Math.round(temp_min)} ℃ / </label>
                      <label className="lbl-det"> ↑ Max: {Math.round(temp_max)} ℃ </label>
                      <label className="lbl-det">Humedad: {weather.main.humidity}% </label>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          }
        </div>
        <div className="col-sm-12 md-12 xs-12">
          {forecast &&
            <div style={{ width: '100%' }}>
              <h4 style={{ color: 'white' }}>Pronóstico para los próximos 5 días</h4><br />
              <div className="row">
                {forecast.map(tiempo => {
                  return (
                    <div className="col-sm-3 md-3 xs-4">
                      <div className="card card-5d" style={{ width: '100%', marginBottom: 10 }}>
                        <div className="card-body">
                          <div className="col-md-11 xs-4">
                            {tiempo.date}
                          </div>
                          <div className="col-md-11 xs-4">
                            <img className="img-responsive icono-weather-size-2" alt={`${tiempo.weather[0].icon}`} src={`http://openweathermap.org/img/wn/${tiempo.weather[0].icon}@2x.png`}></img>
                          </div>
                          <div className="col-md-11 xs-4">
                            {Math.round(tiempo.temp.min)}↓ / {Math.round(tiempo.temp.max)}↑ °C
                          </div>
                          <div className="row flex-nowrap">
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

      </div>
    );
  }
}

export default Clima;