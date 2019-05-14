function checkMembershipLeft(database, member_id){
    return new Promise(function(resolve, reject){
        database.MembershipModel.find({
            'ms_member_id': member_id
        }, function(err, results){
            let value = 0;
            results.reduce(function (total, item) {
                return total.then(async function () {
                    value += item.ms_value;
                })
            }, Promise.resolve()).then(function () {
                resolve(value);
            });
        })
    })
}

module.exports.checkMembershipLeft = checkMembershipLeft;