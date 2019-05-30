function getOneId(database, member_id) {
    return new Promise(function (resolve, reject) {
        database.MemberModel.findOne({
            'member_id': member_id
        }).select("member_name member_phone").exec(function (err, result) {
            if (err)
                reject(err);
            else
                resolve(result);
        })
    })
}

function getIds(database, searchQuery){
    return new Promise(function(resolve, reject){
        database.MemberModel.find(searchQuery)
            .select('_id').exec(function(err, results){
                let ids = [];
                results.forEach(function(item){
                    ids.push(item._id);
                });
                resolve(ids);
        })
    })
}

module.exports.getIds = getIds;
module.exports.getOneId = getOneId;