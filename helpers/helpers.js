const getNewId = (array) => {
    if (array.length > 0) {
        return array[array.length - 1].id + 1;
    }
    return 1;
};

module.exports = {
	getNewId
};
