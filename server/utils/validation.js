var isRealString = (str) => {
    return typeof str === 'String' || str.trim().length > 0;
}

module.exports = {
    isRealString
};