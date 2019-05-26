function sortWithDate(a, b){
    if(a._id.date < b._id.date)
        return -1;
    if(a.index > b.index)
        return 1;
    return 0;
}

module.exports.sortWithDate = sortWithDate;