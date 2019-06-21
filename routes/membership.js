const checkAuth = require('../utils/check_auth');
const member_data = require('../utils/member_data');
const ms_data = require('../utils/membership_data');

function modifyProfit(database, is_del, ms_data, query) {
    return new Promise(function (resolve, reject) {
        const newProfit = new database.ProfitModel({
            'pf_type': is_del ? "환불" : "매출",
            'pf_category': '회원권',
            'pf_category_id': ms_data.ms_id,
            'pf_method': query.msd_method,
            'pf_value': query.msd_value,
            'member_data': ms_data.member_data,
        });
        newProfit.save(function (err) {
            if (err)
                reject(err);
            else {
                console.log("회원권 매출 등록 완료!");
                resolve(true);
            }
        })
    })
}

module.exports = function (router) {

    router.get('/membership', checkAuth.checkLogin, async function (req, res) {
        const database = req.app.get('database');
        const page = req.query.page ? req.query.page : 1;
        const search = req.query.search ? req.query.search : "";
        const start = req.query.start;
        const end = req.query.end;
        let searchQuery = {};
        let memSearchQuerh = {};

        if(!search)
            return res.render('membership', {userID: req.user.user_userID, membership: [], page:1, num:0});
        if(req.query.name)
            memSearchQuerh.member_name = {$regex: new RegExp(req.query.name, "i")};
        if(req.query.phone)
            memSearchQuerh.member_phone = {$regex: new RegExp(req.query.phone, "i")};

        const search_ids = await member_data.getIds(database, memSearchQuerh);
        searchQuery.member_data = {$in:search_ids};
        if(start && end){
            searchQuery.ms_exp_date = {
                "$gte": new Date(start),
                "$lt": new Date(end)
            }
        }

        database.MembershipModel.paginate(searchQuery, {
            page: page,
            limit: 15,
            sort: {created_at: -1},
            populate: 'member_data'
        }, function (err, results) {
            if (err)
                throw err;
            let value_arr = [];
            results.docs.reduce(function (total, item, counter) {
                return total.then(() => ms_data.checkMembershipLeft(database, item.ms_id).then((value) => {
                    value_arr.push({
                        ms_id: item.ms_id,
                        value_left: value
                    });
                }))
            }, Promise.resolve()).then(function () {
                res.render('membership',{
                    userID: req.user.user_userID,
                    membership: results.docs,
                    page: page,
                    num: results.total,
                    value: value_arr
                });
            });
        })
    });

    router.get('/membership/:id', checkAuth.checkLogin, function (req, res) {
        const database = req.app.get('database');
        const ms_id = req.params.id;
        const query = req.query.query ? req.query.query : false;

        database.MembershipModel.findOne({
            'ms_id': ms_id
        }).populate('member_data').exec(function (err, result) {
            if (!query)
                return res.json({ap: result});
            else
                return res.render("view_membership", {
                    userID: req.user.user_userID,
                    ms_data: result.ms_data
                });
        })
    });

    router.get('/membership_member/:id', checkAuth.checkLogin, async function(req, res){
        const database = req.app.get('database');
        const member_id = req.params.id;
        const memSearchQuery = {member_id: member_id};
        const search_ids = await member_data.getIds(database, memSearchQuery);

        database.MembershipModel.find({
            'member_data': {$in:search_ids}
        }).populate('member_data').sort({created_at: -1}).exec(function(err, results){
            let value_arr = [];
            results.reduce(function (total, item, counter) {
                return total.then(() => ms_data.checkMembershipLeft(database, item.ms_id).then((value) => {
                    value_arr.push({
                        ms_id: item.ms_id,
                        value_left: value
                    });
                }))
            }, Promise.resolve()).then(function () {
                res.json({ms_data: results, value: value_arr});
            });
        })
    });

    router.get('/edit_membership', checkAuth.checkAuth, function (req, res) {
        res.render('edit_membership', {userID: req.user.user_userID});
    });

    router.post('/membership', checkAuth.checkAuthJson, async function (req, res) {
        const database = req.app.get('database');
        const member_id = req.body.member_id;
        const objId = await member_data.getOneId(database, member_id);
        const exp_date = new Date(req.body.exp_date);
        const bonus = req.body.bonus;

        let ms_bonus = {};
        if(bonus){
            ms_bonus.msd_value = bonus;
            ms_bonus.msd_type = '보너스';
            ms_bonus.msd_method = '기타';
        }
        const ms_data = {
            'msd_value' : req.body.value,
            'msd_type': '충전',
            'msd_method': req.body.method,
        };

        const newMembership = new database.MembershipModel({
            'member_data': objId._id,
            'ms_exp_date': exp_date,
            'ms_data': bonus ? [ms_data, ms_bonus] : ms_data,
            'ms_init_value': req.body.value
        });
        newMembership.save(async function(err, save_result){
            if(err)
                throw err;
            await modifyProfit(database,false, save_result, ms_data);
            res.json(true);
        })

    });

    router.put('/membership', checkAuth.checkAuthJson, async function (req, res){
        const database = req.app.get('database');
        const ms_id = req.body.ms_id;
        const get_member_id = req.body.get_member_id;
        const type = req.body.type;
        const objId = await member_data.getOneId(database, get_member_id);
        const fee = req.body.fee ? req.body.fee : 0;
        const membership_value = await ms_data.checkMembershipLeft(database, ms_id);
        let value;
        let get_value;
        let query;
        let query2;

        if (type === "양도") {
            value = -req.body.value;
            get_value = req.body.value;
            query = {
                'msd_value': value,
                'msd_type': '양도',
                'msd_method': '기타'
            };
            query2 = {
                'msd_value': get_value,
                'msd_type': '양도',
                'msd_method': '기타'
            };
            if (membership_value + value < 0)
                return res.json(false);
        } else if (type === "환불") {
            value = -(req.body.value - fee);
            query = {
                'msd_value': value,
                'msd_type': type,
                'msd_method': req.body.method
            };
            query2 = {
                'msd_value': -fee,
                'msd_type': "수수료",
                'msd_method': req.body.method
            };
            if (membership_value - req.body.value < 0)
                return res.json(false);
        }


        database.MembershipModel.findOne({
            'ms_id': ms_id
        }, function(err, result){
            if(err)
                throw err;
            result.ms_data.push(query);
            if(type === "환불")
                result.ms_data.push(query2);
            result.save(async function(err, save_result){
                if(err)
                    throw err;
                if(type === "환불") {
                    await modifyProfit(database, true, save_result, query);
                    res.json(true);
                }
                else{
                    const newMembership = new database.MembershipModel({
                        'member_data': objId._id,
                        'ms_exp_date': result.ms_exp_date,
                        'ms_data': query2,
                        'ms_init_value': get_value
                    });
                    newMembership.save(async function(err){
                        if(err)
                            throw err;
                        res.json(true);
                    });
                }

            })
        })
    });

};