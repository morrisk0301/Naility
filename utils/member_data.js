function getNamePhone(database, member_id) {
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

module.exports.getNamePhone = getNamePhone;