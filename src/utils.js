export const utils = {
    unixToDate(unix) {
        const options = { weekday: 'long' };
        return new Date(unix * 1000).toLocaleDateString('es-AR', options)
    },
    unixToTime(unix) {
        return new Date(unix * 1000).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    },
    unixToDateLocale(unix) {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(unix * 1000).toLocaleDateString('es-AR', options)
    },
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    
}