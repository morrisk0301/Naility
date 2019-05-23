const checkLogin = require('../utils/check_login');
const member_data = require('../utils/member_data');

module.exports = function (router) {

    router.get('/profit', checkLogin, function (req, res) {
        const database = req.app.get('database');
        const page = req.query.page ? req.query.page : 1;
        const search = req.query.search ? req.query.search : "";
        const query = req.query.query ? req.query.query : "";
        let searchQuery;

        if (query === "name")
            searchQuery = {'ms_member_name': {$regex: new RegExp(search, "i")}};
        else if (query === "phone")
            searchQuery = {'ms_member_phone': {$regex: new RegExp(search, "i")}};

        database.ProfitModel.paginate(searchQuery, {
            page: page,
            limit: 15,
            sort: {created_at: -1}
        }, function (err, results) {
            if (err)
                throw err;
            res.render('profit', {
                userID: req.user.user_userID,
                profit: results.docs,
                page: page,
                num: results.total
            });
        })
    });

    router.get('/add_profit', checkLogin, function (req, res) {
        res.render('add_profit', {userID: req.user.user_userID});
    });

    router.get('/profit_num', checkLogin, function(req, res){
        const database = req.app.get('database');
        const start = req.query.start;
        const end = req.query.end;

        database.ProfitModel.aggregate([{
            $match: {
                created_at: {
                    $gte: new Date(start),
                    $lt: new Date(end),
                }
            }
        }, {
            $group: {
                _id: {
                    "year": {"$year": {date:'$created_at',timezone:'Asia/Seoul'}},
                    "month": {"$month": {date:'$created_at',timezone:'Asia/Seoul'}},
                    "day": {"$dayOfMonth": {date:'$created_at',timezone:'Asia/Seoul'}}
                },
                count: {$sum: "$pf_value"}
            }
        }]).exec(function (err, data) {
            if (err) {
                throw(err);
            } else {
                res.json(data);
            }
        });
    });

    router.get('/profit_rank', checkLogin, function(req, res){
        const database = req.app.get('database');

        database.ProfitModel.aggregate([{
            $match: {}
        }, {
            $group: {
                _id: {
                    "id": "$pf_member_id",
                    "name": "$pf_member_name",
                    "phone": "$pf_member_phone"
                },
                count: {$sum: "$pf_value"}
            }
        }]).sort({count: -1}).limit(5).exec(function (err, data) {
            if (err) {
                throw(err);
            } else {
                res.json(data);
            }
        });
    });

    router.get('/profit_method', checkLogin, function(req, res){
        const database = req.app.get('database');

        database.ProfitModel.aggregate([{
            $match: {}
        }, {
            $group: {
                _id: {
                    "method": "$pf_member_id",
                    "name": "$pf_member_name",
                    "phone": "$pf_member_phone"
                },
                count: {$sum: "$pf_value"}
            }
        }]).sort({count: -1}).limit(5).exec(function (err, data) {
            if (err) {
                throw(err);
            } else {
                res.json(data);
            }
        });
    });

    router.post('/profit', checkLogin, async function (req, res) {
        const database = req.app.get('database');
        const namePhone = await member_data.getNamePhone(database, req.body.member_id);

        const newProfit = new database.ProfitModel({
            'pf_member_id': req.body.member_id,
            'pf_member_name': namePhone.member_name,
            'pf_member_phone': namePhone.member_phone,
            'pf_value': req.body.pf_value,
            'pf_type': req.body.pf_type,
            'pf_category': req.body.pf_category
        });
        newProfit.save(function(err){
            if(err)
                throw err;
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
            res.write('<script type="text/javascript">alert("매출이 등록되었습니다.");window.location.reload();</script>');
            res.end();
        })
    });
};