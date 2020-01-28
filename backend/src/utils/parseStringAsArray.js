module.exports = function parseStringAsArray(arrayAsString){
    return arrayAsString.split(',').map(arrayItem => arrayItem.trim());
}