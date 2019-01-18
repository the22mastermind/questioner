const getNewId = (array) => {
    if (array.length > 0) {
        return array[array.length - 1].id + 1;
    }
    return 1;
};

const newDate = () => new Date().toString();

const upVote = (integer) => {
    return integer + 1;
};


module.exports = {
    getNewId,
    newDate,
    upVote
};
