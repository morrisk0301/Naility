function checkMembershipLeft(database, ms_id){
    return new Promise(function(resolve, reject){
        database.MembershipModel.findOne({
            'ms_id': ms_id
        }, function(err, result){
            let value = 0;
            result.ms_data.reduce(function (total, item, counter) {
                return total.then(async function () {
                    value += item.msd_value;
                })
            }, Promise.resolve()).then(function () {
                resolve(value);
            });
        })
    })
}

module.exports.checkMembershipLeft = checkMembershipLeft;