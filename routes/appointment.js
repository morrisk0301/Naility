const checkAuth = require('../utils/check_auth');
const ms_data = require('../utils/membership_data');
const member_data = require('../utils/member_data');
const sort = require('../utils/sort');

function convertProcedureName(database, procedure) {
    return new Promise(function (resolve, reject) {
        let procedure_name = "";
        procedure.reduce(function (total, item, counter) {
            return total.then(() => getProcedureName(database, item).then(function (procedure_result) {
                if (counter === procedure.length - 1)
                    procedure_name = procedure_name + procedure_result;
                else
                    procedure_name = procedure_name + procedure_result + ", ";
            }))
        }, Promise.resolve()).then(function () {
            resolve(procedure_name);
        });
    });
}

function convertProcedureArr(database, procedure) {
    return new Promise(function (resolve, reject) {
        let procedure_arr = [];
        procedure.reduce(function (total, item, counter) {
            return total.then(() => getProcedureName(database, item).then(function (procedure_result) {
                procedure_arr.push(procedure_result);
            }))
        }, Promise.resolve()).then(function () {
            resolve(procedure_arr);
        });
    });
}

function getProcedureName(database, procedure_id) {
    return new Promise(function (resolve, reject) {
        database.ProcedureModel.findOne({
            'procedure_id': procedure_id
        }, function (err, result) {
            if (err)
                reject(err);
            else
                resolve(result.procedure_name);
        })
    })
}

function addProfit(database, ap_data) {
    return new Promise(function (resolve, reject) {
        const newProfit = new database.ProfitModel({
            'pf_member_id': ap_data.ap_member_id,
            'pf_member_name': ap_data.ap_member_name,
            'pf_member_phone': ap_data.ap_member_phone,
            'pf_category': '시술',
            'pf_type': '매출',
            'pf_value': ap_data.ap_discount_price,
            'pf_method': ap_data.ap_payment_method,
            'created_at': ap_data.ap_date
        });
        newProfit.save(function (err) {
            if (err)
                reject(err);
            else {
                console.log("시술 매출 등록 완료!");
                resolve(true);
            }
        })
    })
}

function modifyMembership(database, ms_id, price) {
    return new Promise(async function (resolve, reject) {
        const ms_data = {
            'msd_value': -price,
            'msd_type': '사용',
            'msd_method': '회원권',
        };
        database.MembershipModel.findOne({
            'ms_id': ms_id
        }, function (err, result) {
            if (err)
                throw err;
            result.ms_data.push(ms_data);
            result.save(function (err) {
                if (err)
                    reject(err);
                else {
                    console.log("회원권 매출 등록 완료!");
                    resolve(true);
                }
            })
        });
    })
}

module.exports = function (router) {

    router.get('/appointment', checkAuth.checkLogin, function (req, res) {
        const database = req.app.get('database');
        const page = req.query.page ? req.query.page : 1;
        const search = req.query.search ? req.query.search : "";
        const query = req.query.query;
        const start = req.query.start;
        const end = req.query.end;
        let searchQuery = {};

        if (query === 'calendar') {
            database.AppointmentModel.find({}).select('ap_id ap_date ap_date_end ap_member_name ap_member_phone ap_procedure_name ap_price').exec(function (err, result) {
                res.json(result);
            });
        } else if (!search) {
            process.nextTick(function () {
                res.render('appointment', {userID: req.user.user_userID, appointment: [], page: 1, num: 0});
            })
        } else {
            if (req.query.name)
                searchQuery.ap_member_name = {$regex: new RegExp(req.query.name, "i")};
            if (req.query.phone)
                searchQuery.ap_member_phone = {$regex: new RegExp(req.query.phone, "i")};
            if (start && end) {
                searchQuery.ap_date = {
                    "$gte": new Date(start),
                    "$lt": new Date(end)
                }
            }
            database.AppointmentModel.paginate(searchQuery, {
                page: page,
                limit: 15,
                sort: {created_at: -1}
            }, function (err, results) {
                if (err)
                    throw err;
                res.render('appointment', {
                    userID: req.user.user_userID,
                    appointment: results.docs,
                    page: page,
                    num: results.total
                });
            })
        }
    });

    router.get('/end_appointment', checkAuth.checkAuth, function (req, res) {
        const database = req.app.get('database');
        const page = req.query.page ? req.query.page : 1;

        database.AppointmentModel.paginate({
            'ap_is_finished': false
        }, {page: page, limit: 5, sort: {created_at: -1}}, function (err, results) {
            res.render('end_appointment', {userID: req.user.user_userID, appointment: results.docs, page: page});
        });
    });

    router.get('/appoint_unfinished_num', checkAuth.checkLogin, function (req, res) {
        const database = req.app.get('database');

        database.AppointmentModel.find({
            'ap_is_finished': false
        }).count(function (err, count) {
            res.json(count);
        })
    });

    router.get('/appointment_month', checkAuth.checkLogin, function (req, res) {
        const database = req.app.get('database');
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        database.AppointmentModel.find({
            "created_at": {
                "$gte": {date: firstDay, timezone: 'Asia/Seoul'},
                "$lt": {date: lastDay, timezone: 'Asia/Seoul'}
            }
        }).count(function (err, result) {
            res.json(result);
        })
    });

    router.get('/view_appointment', checkAuth.checkLogin, function (req, res) {
        res.render('view_appointment', {userID: req.user.user_userID, modify: false});
    });

    router.get('/appointment_calendar', checkAuth.checkLogin, function (req, res) {
        res.render('appointment_calendar', {userID: req.user.user_userID});
    });


    router.get('/appointment/:id', checkAuth.checkAuthClose, function (req, res) {
        const database = req.app.get('database');
        const ap_id = req.params.id;
        const query = req.query.query ? req.query.query : false;

        database.AppointmentModel.findOne({
            'ap_id': ap_id
        }, function (err, result) {
            if (!query)
                return res.json({ap: result});
            else
                return res.render("view_appointment", {
                    userID: req.user.user_userID,
                    modify: query === "modify",
                    ap: result
                });
        })
    });

    router.get('/appointment_member/:id', checkAuth.checkLogin, function (req, res) {
        const database = req.app.get('database');
        const member_id = req.params.id;
        database.AppointmentModel.find({
            'ap_member_id': member_id
        }, function (err, results) {
            res.json(results);
        })
    });

    router.get('/appointment_num', checkAuth.checkLogin, function (req, res) {
        const database = req.app.get('database');
        const start = req.query.start;
        const end = req.query.end;
        const total = req.query.total;

        if (total) {
            const searchQuery = !start ? {} :
                {
                    "created_at": {
                        "$gte": new Date(start),
                        "$lt": new Date(end)
                    }
                };
            database.AppointmentModel.find(searchQuery).count(function (err, count) {
                res.json(count);
            })
        } else {
            database.AppointmentModel.aggregate([{
                $match: {
                    ap_date: {
                        $gte: new Date(start),
                        $lt: new Date(end),
                    }
                }
            }, {
                $group: {
                    _id: {
                        "year": {"$year": {date: '$ap_date', timezone: 'Asia/Seoul'}},
                        "month": {"$month": {date: '$ap_date', timezone: 'Asia/Seoul'}},
                        "day": {"$dayOfMonth": {date: '$ap_date', timezone: 'Asia/Seoul'}},
                        "date": {"$dateToString": {date: '$ap_date', timezone: 'Asia/Seoul', format: "%Y-%m-%d"}}
                    },
                    count: {$sum: 1},
                },
            }]).exec(function (err, data) {
                if (err) {
                    throw(err);
                } else {
                    data = data.sort(sort.sortWithDate);
                    res.json(data);
                }
            });
        }
    });

    router.get('/apointment_method_rank', checkAuth.checkLogin, function (req, res) {
        const database = req.app.get('database');
        database.AppointmentModel.aggregate([{
            $match: {
                'ap_is_finished': true,
            }
        }, {
            $group: {
                _id: {
                    "method": "$ap_payment_method",
                },
                count: {$sum: "$ap_discount_price"}
            }
        }]).sort({count: -1}).limit(5).exec(function (err, data) {
            if (err) {
                throw(err);
            } else {
                let sum = 0;
                data.forEach(function(item){
                    sum += item.count;
                });
                res.json({ap_data: data, count: sum });
            }
        });
    });

    router.get('/apointment_method_rank', checkAuth.checkLogin, function (req, res) {
        const database = req.app.get('database');
        database.AppointmentModel.aggregate([{
            $match: {
                'ap_is_finished': true,
            }
        }, {
            $group: {
                _id: {
                    "method": "$ap_payment_method",
                },
                count: {$sum: "$ap_discount_price"}
            }
        }]).sort({count: -1}).limit(5).exec(function (err, data) {
            if (err) {
                throw(err);
            } else {
                let sum = 0;
                data.forEach(function(item){
                    sum += item.count;
                });
                res.json({ap_data: data, count: sum });
            }
        });
    });

    router.get('/appointment_type_rank', checkAuth.checkLogin, function (req, res) {
        const database = req.app.get('database');
        database.AppointmentModel.aggregate([{
            $match: {
                'ap_is_finished': true,
            }
        }, {
            $project : {
                ap_procedure_arr : 1
            }
        }, {
            $unwind: '$ap_procedure_arr'
        }, {
            $group: {
                _id: {
                    "procedure" : "$ap_procedure_arr"
                },
                count: {$sum: 1}
            }
        }]).sort({count: -1}).limit(5).exec(function (err, data) {
            if (err) {
                throw(err);
            } else {
                let sum = 0;
                data.forEach(function(item){
                    sum += item.count;
                });
                res.json({ap_data: data, count: sum });
            }
        });
    });

    router.post('/appointment', checkAuth.checkLogin, async function (req, res) {
        const database = req.app.get('database');
        const member_id = req.body.member_id;
        const procedure = JSON.parse(req.body.procedure);
        const date = req.body.date;
        const date_end = req.body.date_end;
        const price = req.body.price;
        const namePhone = await member_data.getNamePhone(database, member_id);
        const procedure_name = await convertProcedureName(database, procedure);
        const procedure_arr = await convertProcedureArr(database, procedure);

        const newAppointment = new database.AppointmentModel({
            'ap_member_id': member_id,
            'ap_member_name': namePhone.member_name,
            'ap_member_phone': namePhone.member_phone,
            'ap_procedure_name': procedure_name,
            'ap_procedure_arr': procedure_arr,
            'ap_date': date,
            'ap_date_end': date_end,
            'ap_price': price
        });

        newAppointment.save(function (err, result) {
            if (err) {
                res.json({err: err});
            } else
                res.json(result)
        })
    });

    router.put('/appointment/:id', checkAuth.checkAuth, async function (req, res) {
        const database = req.app.get('database');
        const query = req.query.query ? req.query.query : false;
        const ap_id = req.params.id;
        const ms_id = req.body.ms_id;
        const procedure = req.body.procedure ? JSON.parse(req.body.procedure) : "";
        const date = req.body.date;
        const date_end = req.body.date_end;
        const price = req.body.price;
        const real_price = req.body.real_price;
        const method = req.body.method;
        const detail = req.body.detail;
        const blacklist = req.body.blacklist;
        const procedure_name = !req.body.searched ? false: await convertProcedureName(database, procedure);
        const procedure_arr = !req.body.searched ? procedure: await convertProcedureArr(database, procedure);
        const membership_value = !ms_id ? 0 : await ms_data.checkMembershipLeft(database, ms_id);

        database.AppointmentModel.findOne({
            'ap_id': ap_id
        }, async function (err, result) {
            if (err)
                throw err;
            if (method === "회원권" && membership_value - real_price < 0) {
                process.nextTick(function () {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
                    res.write('<script type="text/javascript">alert("회원권 잔액이 부족합니다.");window.location.reload();</script>');
                    res.end();
                })
            } else {
                if (query === 'date') {
                    result.ap_date = date;
                    result.ap_date_end = date_end;
                    if (result.ap_is_finished) {
                        return res.json(false);
                    }
                } else {
                    if (query !== "modify") {
                        if(req.body.searched) result.ap_procedure_name = procedure_name;
                        result.ap_procedure_arr = procedure_arr;
                        result.ap_price = price;
                        result.ap_discount_price = real_price;
                    }
                    result.ap_payment_method = method;
                    result.ap_detail = detail;
                    result.ap_blacklist = blacklist;
                    result.ap_is_finished = true;
                }

                result.save(async function (err, result) {
                    if (err)
                        throw err;
                    if (query === 'date')
                        return res.json(true);
                    else if (query === "modify") {
                        process.nextTick(function () {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
                            res.write('<script type="text/javascript">alert("예약이 수정되었습니다.");window.opener.location.reload();window.close();</script>');
                            res.end();
                        })
                    } else {
                        let success;
                        if (result.ap_payment_method === "회원권") {
                            success = await modifyMembership(database, ms_id, result.ap_discount_price);
                        } else {
                            success = await addProfit(database, result);
                        }
                        res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
                        if (success) {
                            res.write('<script type="text/javascript">alert("예약이 마감되었습니다.");window.location.reload();</script>');
                        } else {
                            res.write('<script type="text/javascript">alert("예약이 마감에 실패하였습니다.");window.location.reload();</script>');
                        }
                        res.end();
                    }
                })
            }
        })
    });

    router.delete('/appointment/:id', checkAuth.checkAuth, async function (req, res) {
        const database = req.app.get('database');
        const ap_id = req.params.id;

        database.AppointmentModel.deleteOne({
            'ap_id': ap_id,
            'ap_is_finished': false
        }, function (err, result) {
            if (err)
                throw err;
            else {
                if (result.n === 0)
                    res.json(false);
                else
                    res.json(true);
            }

        })
    });
};