const checkAuth = require('../utils/check_auth');
const member_data = require('../utils/member_data');
const Excel = require('exceljs');
const sort = require('../utils/sort');

module.exports = function (router) {
    router.get('/profit', checkAuth.checkAuth, function (req, res) {
        const database = req.app.get('database');
        const page = req.query.page ? req.query.page : 1;
        const search = req.query.search ? req.query.search : "";
        const start = req.query.start;
        const end = req.query.end;
        let searchQuery = {};

        if(!search)
            return res.render('profit', {userID: req.user.user_userID, profit: [], page:1, num:0});
        if(req.query.name)
            searchQuery.pf_member_name = {$regex: new RegExp(req.query.name, "i")};
        if(req.query.phone)
            searchQuery.pf_member_phone = {$regex: new RegExp(req.query.phone, "i")};
        if(req.query.type)
            searchQuery.pf_type = {$regex: new RegExp(req.query.type, "i")};
        if(req.query.category)
            searchQuery.pf_category = {$regex: new RegExp(req.query.category, "i")};
        if(req.query.method)
            searchQuery.pf_method = {$regex: new RegExp(req.query.method, "i")};

        if(start && end){
            searchQuery.created_at = {
                "$gte": new Date(start),
                "$lt": new Date(end)
            }
        }

        if(req.query.excel){
            database.ProfitModel.find(searchQuery, function(err, result){
                const workbook = new Excel.Workbook();
                const worksheet = workbook.addWorksheet('매출 조회');
                worksheet.columns = [
                    { header: '매출 ID', key: 'pf_id'},
                    { header: '회원 ID', key: 'pf_member_id'},
                    { header: '회원 이름', key: 'pf_member_name'},
                    { header: '매출 구분', key: 'pf_type' },
                    { header: '매출 종류', key: 'pf_category' },
                    { header: '결제 수단', key: 'pf_method' },
                    { header: '금액', key: 'pf_value' },
                    { header: '일자', key: 'created_at' },
                ];
                result.reduce(function (total, item, counter) {
                    return total.then(async function () {
                        worksheet.addRow(item);
                    })
                }, Promise.resolve()).then(function () {
                    workbook.xlsx.writeBuffer().then((buffer) => {
                        res.json(new Buffer(buffer, 'array'));
                    });
                });
            })
        }
        else {
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
        }
    });

    router.get('/add_profit', checkAuth.checkAuth, function (req, res) {
        res.render('add_profit', {userID: req.user.user_userID});
    });

    router.get('/profit_num', checkAuth.checkLogin, function(req, res){
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
                    "day": {"$dayOfMonth": {date:'$created_at',timezone:'Asia/Seoul'}},
                    "date": {"$dateToString": {date:'$created_at',timezone:'Asia/Seoul', format: "%Y-%m-%d"}}
                },
                count: {$sum: "$pf_value"}
            }
        }]).exec(function (err, data) {
            if (err) {
                throw(err);
            } else {
                data = data.sort(sort.sortWithDate);
                res.json(data);
            }
        });
    });

    router.get('/profit_rank', checkAuth.checkLogin, function(req, res){
        const database = req.app.get('database');

        database.ProfitModel.aggregate([{
            $match: {}
        }, {
            $group: {
                _id: {
                    "id": "$pf_member_id",
                    "name": "$pf_member_name",
                    "phone": "$pf_member_phone",
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


    router.post('/profit', checkAuth.checkAuth, async function (req, res) {
        const database = req.app.get('database');
        const namePhone = await member_data.getNamePhone(database, req.body.member_id);

        const newProfit = new database.ProfitModel({
            'pf_member_id': req.body.member_id,
            'pf_member_name': namePhone.member_name,
            'pf_member_phone': namePhone.member_phone,
            'pf_value': req.body.pf_value,
            'pf_type': req.body.pf_type,
            'pf_category': req.body.pf_category,
            'pf_method': req.body.pf_method
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