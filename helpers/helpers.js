const getNewId = (array) => {
    if (array.length > 0) {
        return array[array.length - 1].id + 1
    } else {
        return 1
    }
};

const newDate = () => new Date().toString();

const getVotes = (array) => {
    if (array.length > 0) {
        return array[array.length - 1].votes
    } else {
        return 0
    }
};


module.exports = {
    getNewId,
    newDate,
    getVotes
};