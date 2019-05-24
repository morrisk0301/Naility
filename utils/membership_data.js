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

function deleteValue(database, ms_data){
    return new Promise(async function(resolve, reject){
        const value_left = await checkMembershipLeft(database, ms_data.ms_id);
        const query = {
            'msd_value': -value_left,
            'msd_type': "만료",
            'msd_method': "기타"
        };
        database.MembershipModel.findOne({
            'ms_id': ms_data.ms_id
        }, function(err, result){
            result.ms_data.push(query);
            result.ms_is_expired = true;
            result.save(function(err){
                if(err)
                    throw err;
                resolve(true);
            })
        })
    })
};

function expireMembership(database){
    return new Promise(function(resolve, reject){
        const date = new Date();
        const iso = date.toISOString();

        database.MembershipModel.find({
            'ms_exp_date': {
                "$lt": iso
            },
            'ms_is_expired': false
        }, function(err, results){
            if(err){
                console.log("유효기간 만료 회원권이 없습니다!");
                resolve(true);
            }
            else {
                resolve(true);

                results.reduce(function (total, item, counter) {
                    return total.then(() => deleteValue(database, item).then((success) => {

                    }))
                }, Promise.resolve()).then(function () {
                    console.log('유효기간 만료 회원권 초기화 완료!');
                    resolve(true);
                });
            }
        })
    })
}

module.exports.checkMembershipLeft = checkMembershipLeft;
module.exports.expireMembership = expireMembership;