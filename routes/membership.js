const checkLogin = require('../utils/check_login');
const member_data = require('../utils/member_data');
const ms_data = require('../utils/membership_data');

module.exports = function (router) {

    router.get('/membership', checkLogin, function (req, res) {
        const database = req.app.get('database');
        const page = req.query.page ? req.query.page : 1;
        const search = req.query.search ? req.query.search : "";
        const query = req.query.query ? req.query.query : "";
        let searchQuery;
        console.log(query);
        if(query==="name")
            searchQuery = {'ms_member_name': {$regex: new RegExp(search, "i")}};
        else if(query==="phone")
            searchQuery = {'ms_member_phone': {$regex: new RegExp(search, "i")}};

        database.MembershipModel.paginate(searchQuery, {
            page: page,
            limit: 15,
            sort: {created_at: -1}
        }, function (err, results) {
            console.log(results.docs);
            if (err)
                throw err;
            res.render('membership', {
                userID: req.user.user_userID,
                membership: results.docs,
                page: page,
                num: results.total
            });
        })
    });

    router.get('/edit_membership', checkLogin, function (req, res) {
        res.render('edit_membership', {userID: req.user.user_userID});
    });

    router.post('/membership', checkLogin, async function (req, res) {
        const database = req.app.get('database');
        const member_id = req.body.member_id;
        const get_member_id = req.body.get_member_id;
        const type = req.body.type;
        const namePhone = await member_data.getNamePhone(database, member_id);
        const get_namePhone = await member_data.getNamePhone(database, get_member_id);
        const fee = req.body.fee ? req.body.fee : 0;
        const membership_value = await ms_data.checkMembershipLeft(database, member_id);
        let value;
        let get_value;

        if (type === "충전")
            value = req.body.value;
        else if (type === "양도") {
            value = -req.body.value;
            get_value = req.body.value;
            if(membership_value + value < 0)
                return res.json(false);
        }
        else if(type==="환불"){
            value = -(req.body.value - fee);
            if(membership_value - req.body.value < 0)
                return res.json(false);
        }

        const newMembership = new database.MembershipModel({
            'ms_member_id': member_id,
            'ms_member_name': namePhone.member_name,
            'ms_member_phone': namePhone.member_phone,
            'ms_value': value,
            'ms_type': type
        });

        newMembership.save(function (err) {
            if (err)
                throw err;
            if (type === "양도") {
                const newMembership2 = new database.MembershipModel({
                    'ms_member_id': get_member_id,
                    'ms_member_name': namePhone.member_name,
                    'ms_member_phone': namePhone.member_phone,
                    'ms_value': get_value,
                    'ms_type': "양수"
                });
                newMembership2.save(function (err) {
                    if (err)
                        throw err;
                    res.json(true);
                });
            } else if (type === "환불") {
                const newMembership2 = new database.MembershipModel({
                    'ms_member_id': member_id,
                    'ms_member_name': namePhone.member_name,
                    'ms_member_phone': namePhone.member_phone,
                    'ms_value': -fee,
                    'ms_type': "수수료"
                });
                newMembership2.save(function (err) {
                    if (err)
                        throw err;
                    res.json(true);
                });
            } else {
                process.nextTick(function () {
                    res.json(true);
                })
            }
        })
    });
};