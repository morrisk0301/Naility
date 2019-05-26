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


function modifyAP(database, member_data){
    return new Promise(function(resolve, reject){
        database.AppointmentModel.updateMany({
            'ap_member_id': member_data.member_id
        }, {"$set": {
                'ap_member_name' : member_data.member_name,
                'ap_member_phone' : member_data.member_phone,
            }
        }, function(err){
            if(err)
                reject(err);
            else
                resolve(true);
        })
    })
}

function modifyPF(database, member_data){
    return new Promise(function(resolve, reject){
        database.ProfitModel.updateMany({
            'pf_member_id': member_data.member_id
        }, {"$set": {
                'pf_member_name' : member_data.member_name,
                'pf_member_phone' : member_data.member_phone,
            }
        }, function(err){
            if(err)
                reject(err);
            else
                resolve(true);
        })
    })
}

function modifyMS(database, member_data){
    return new Promise(function(resolve, reject){
        database.MembershipModel.updateMany({
            'ms_member_id': member_data.member_id
        }, {"$set": {
                'ms_member_name' : member_data.member_name,
                'ms_member_phone' : member_data.member_phone,
            }
        }, function(err){
            if(err)
                reject(err);
            else
                resolve(true);
        })
    })
}
function modifyNamePhone(database, member_data){
    return new Promise(async function(resolve, reject){
        await modifyAP(database, member_data);
        await modifyMS(database, member_data);
        await modifyPF(database, member_data);
        resolve(true);
    })
}

module.exports.getNamePhone = getNamePhone;
module.exports.modifyNamePhone = modifyNamePhone;