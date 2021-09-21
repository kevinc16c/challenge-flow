import React from 'react'
import Datos from './Datos.json'
class Selector extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
        this.state = {
            data: Datos
        }
    }
    
    handleChange(event){
        let value = event.target.value, localidad = {}
        const { data } = this.state
        if(value !== "0"){
            localidad = data.filter(item => item.id === value)
            this.props.onSelectLocalidad(localidad[0])
        }
    }
    render() {
        const { data } = this.state
        return (
            <select className="form-select" onChange={this.handleChange}>
                <option defaultValue value="0">Seleccione una localidad</option>
                {data.map(localidad => <option value={localidad.id}>{localidad.ciudad}</option>)}
            </select>
        )
    }
}
export default Selector