module.exports = function alertError(err) {
    if (err instanceof Error) {
        alert(err.stack);
    } else {
        alert('Promise rejected with: ', err);
    }
};