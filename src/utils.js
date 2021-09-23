export const utils = {
    unixToDate(unix) {
        const options = { weekday: 'long' };
        return new Date(unix * 1000).toLocaleDateString('es-AR', options)
    },
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
}