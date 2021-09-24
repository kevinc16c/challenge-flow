export const config = {
    APP_ID: "a23470dac84c28f6183779493c54435a",
    ENDPOINT_CURRENT: "https://api.openweathermap.org/data/2.5/weather?&lang=es&",
    ENDPOINT_FORECAST: "https://api.openweathermap.org/data/2.5/onecall?&lang=es&exclude=minutely&",
    TITULOS_CLIMA:[
        {
            d_icon_name:"01d",
            n_icon_name:"01n",
            description:"Despejado",
        },
        {
            d_icon_name:"02d",
            n_icon_name:"02n",
            description:"Parcialmente nublado",
        },
        {
            d_icon_name:"03d",
            n_icon_name:"03n",
            description:"Nublado",
        },
        {
            d_icon_name:"04d",
            n_icon_name:"04n",
            description:"Nubes rotas",
        },
        {
            d_icon_name:"09d",
            n_icon_name:"09n",
            description:"Aguacero",
        },
        {
            d_icon_name:"10d",
            n_icon_name:"10n",
            description:"Lluvia",
        },
        {
            d_icon_name:"11d",
            n_icon_name:"11n",
            description:"Tormenta",
        },
        {
            d_icon_name:"13d",
            n_icon_name:"13n",
            description:"Nieve",
        },
        {
            d_icon_name:"50d",
            n_icon_name:"50n",
            description:"Neblina",
        },
    ]
}