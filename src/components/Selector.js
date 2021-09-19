import React from 'react'
import Datos from './Datos.json'
class Selector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: Datos
        }
    }
    renderOptions() {
        const { data } = this.state
        return data.map(localidad => <option value={localidad.id}>{localidad.ciudad}</option>)
    }
    handleChange(event){
        let value = event.target.value
        console.log(value)
    }
    render() {
        const { data } = this.state
        return (
            <select className="form-select" onChange={this.handleChange}>
                <option defaultValue value="0">Seleccione una localidad</option>
                {/* {this.renderOptions()} */}
                {data.map(localidad => <option value={localidad.id}>{localidad.ciudad}</option>)}
            </select>
        )
    }
}
export default Selector