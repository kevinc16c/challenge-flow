import React from "react";
import { config } from '../config';
import { utils } from "../utils";
import './styles.scss';

class Clima extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: null,
      selectedWeather: null,
      forecast: null,
      lat: 0.0,
      lon: 0.0,
      metric: "",
      temp: 0,
      feels_like: 0,
      temp_min: 0,
      temp_max: 0,
      title: "",
      units: 'metric',
      unitTitle: '℃',
    }
    this.prepareResult = this.prepareResult.bind(this);
    this.changeUnits = this.changeUnits.bind(this);
    this.getCord = this.getCord.bind(this);
    this.selectWeather = this.selectWeather.bind(this);
  }

  async componentDidMount() {
    this.getCord();
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

  getCord() {
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
          selectedWeather: null,
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
    this.setState({ forecast: datos })
  }
  changeUnits(unit) {
    if (unit === "C") {
      return this.setState({ units: 'metric', unitTitle: '℃' }, () => {
        this.fetch_current();
        this.fetch_forecast();
      })
    } else {
      return this.setState({ units: 'imperial', unitTitle: '℉' }, () => {
        this.fetch_current();
        this.fetch_forecast();
      })
    }
  }

  selectWeather(selectedWeather) {
    this.setState({ selectedWeather })
  }

  render() {
    const { weather, title, temp_min, temp_max, forecast, temp, feels_like, units, selectedWeather, unitTitle } = this.state;
    return (
      <div className="clima">
        {weather &&
          <div>
            <h4 style={{ color: 'white' }}>Pronóstico actual</h4><br />
            <div className="card" style={{ width: '100%', backgroundColor: '#b8b8b8' }}>
              <div className="card-header">
                {utils.capitalizeFirstLetter(utils.unixToDate(weather.dt))}
              </div>
              <div className="card-body">
                <h3 className="card-title" style={{ float: 'left', marginBottom: 'auto' }}>
                  <img className="img-responsive icono-weather-size" alt={`${weather.weather[0].icon}`} src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}></img>
                  <br />
                  <label><b>{title}</b></label>
                </h3>
                <p className="card-text">
                  <div className="row flex-nowrap">
                    <div className="col-md-4 xs-3">
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
                      <label className="lbl-det">Sensación térmica: {Math.round(feels_like)} {unitTitle}</label><br />
                      <label className="lbl-det"> ↓ Min: {Math.round(temp_min)} {unitTitle} / </label>
                      <label className="lbl-det"> ↑ Max: {Math.round(temp_max)} {unitTitle} </label>
                    </div>
                    <div className="col-md-3 xs-4">
                      <label className="lbl-det">
                        Visibilidad: {weather.visibility / 1000} km <br />
                        Humedad: {weather.main.humidity}% <br />
                        Viento: {weather.wind.speed} km/h
                      </label>
                    </div>
                    <div className="col-md-4 xs-3">

                      {new Date().toLocaleDateString()}
                      <br />
                      {weather.name}
                      <br />
                      <button className="btn btn-outline-dark refresh-button" onClick={this.getCord}>
                        Ver en mi ciudad
                      </button>
                    </div>
                  </div>
                </p>

              </div>
            </div>
          </div>
        }
        {forecast &&
          <div style={{ width: '100%' }}>
            <h4 style={{ color: 'white' }}>Pronóstico para los próximos 5 días</h4><br />
            <div className="row">
              {forecast.map(tiempo => {
                return (
                  <div className="col-sm-3 md-3 xs-4">
                    <div className="card-5d" onClick={() => { this.selectWeather(tiempo) }}>
                      <div className="card-body">
                        <div className="col-md-11 xs-4">
                          {tiempo.date}
                        </div>
                        <div className="col-md-11 xs-4">
                          <img className="img-responsive icono-weather-size-2" alt={`${tiempo.weather[0].icon}`} src={`http://openweathermap.org/img/wn/${tiempo.weather[0].icon}@2x.png`}></img>
                        </div>
                        <div className="col-md-11 xs-4">
                          {Math.round(tiempo.temp.min)}↓ / {Math.round(tiempo.temp.max)}↑ {unitTitle}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        }
        <br />
        {selectedWeather &&
          <div className="card text-center" style={{ backgroundColor: '#b8b8b8', marginBottom: 10 }}>
            <div className="card-header">
              {utils.capitalizeFirstLetter(utils.unixToDate(selectedWeather.dt))}
            </div>
            <div className="card-body">
              <h3 className="card-title" style={{ float: 'left' }}>
                <img className="img-responsive icono-weather-size" alt={`${selectedWeather.weather[0].icon}`} src={`http://openweathermap.org/img/wn/${selectedWeather.weather[0].icon}@2x.png`}></img>
                <br />
                <label><b>{utils.capitalizeFirstLetter(selectedWeather.weather[0].description)}</b></label>
              </h3>
              <p className="card-text">
                <div className="row flex-nowrap">
                  <div className="col-md-4 xs-3">
                    <label className="lbl-temp">{Math.round(selectedWeather.temp.day)} {unitTitle}
                    </label><br />
                    <label className="lbl-det">Sensación térmica: {Math.round(feels_like)} {unitTitle} <br />
                      ↓ Min: {Math.round(temp_min)} {unitTitle} / ↑ Max: {Math.round(temp_max)} {unitTitle}
                    </label>
                  </div>
                  <div className="col-md-3 xs-4">
                    <label className="lbl-det">
                      Humedad: {selectedWeather.humidity}% <br />
                      Viento: {selectedWeather.wind_speed} km/h <br />
                      Ráfagas de viento: {selectedWeather.wind_gust} km/h
                    </label>
                  </div>
                  <div className="col-md-4 xs-3">

                    {utils.unixToDateLocale(selectedWeather.dt)}
                    <br />
                    <label className="lbl-det">
                      Salida del sol:   {utils.unixToTime(selectedWeather.sunrise)} <br />
                      Puesta del sol:   {utils.unixToTime(selectedWeather.sunset)}
                    </label>
                  </div>
                </div>

              </p>

              <table className="table" style={{ fontSize: '14px', float: 'right' }}>
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">Temperatura</th>
                    <th scope="col"> </th>
                    <th scope="col"> </th>
                    <th scope="col"> </th>
                    <th scope="col">Sensación térmica</th>

                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Mañana</th>
                    <td>{Math.round(selectedWeather.temp.morn)} {unitTitle}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{Math.round(selectedWeather.feels_like.morn)} {unitTitle}</td>
                  </tr>
                  <tr>
                    <th scope="row">Tarde</th>
                    <td>{Math.round(selectedWeather.temp.eve)} {unitTitle}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{Math.round(selectedWeather.feels_like.eve)} {unitTitle}</td>
                  </tr>
                  <tr>
                    <th scope="row">Noche</th>
                    <td>{Math.round(selectedWeather.temp.night)} {unitTitle}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{Math.round(selectedWeather.feels_like.night)} {unitTitle}</td>
                  </tr>
                </tbody>
              </table>

            </div>
          </div>
        }
      </div>
    );
  }
}

export default Clima;