const checkLogin = require('../utils/check_login');

module.exports = function (router) {

    function convertProcedureName(database, procedure){
        return new Promise(function(resolve, reject){
            let procedure_name = "";
            procedure.reduce(function (total, item, counter) {
                return getProcedureName(database, item).then(function (procedure_result) {
                    if(counter === procedure.length-1)
                        procedure_name = procedure_name + procedure_result;
                    else
                        procedure_name = procedure_name + procedure_result + ", ";
                })
            }, Promise.resolve()).then(function () {
                resolve(procedure_name);
            });
        });
    }

    function getProcedureName(database, procedure_id){
        return new Promise(function(resolve, reject){
            database.ProcedureModel.findOne({
                'procedure_id': procedure_id
            }, function(err, result){
                if(err)
                    reject(err);
                else
                    resolve(result.procedure_name);
            })
        })
    }

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

    router.get('/appointment', checkLogin, function (req, res) {
        const database = req.app.get('database');
        const page = req.query.page ? req.query.page : 1;
        const search = req.query.search ? req.query.search : "";
        const query = req.query.query;
        const searchQuery = query === "name" ? {'ap_member_name': {$regex: new RegExp(search, "i")}} : {'ap_member_phone': {$regex: new RegExp(search, "i")}};

        database.AppointmentModel.paginate(searchQuery, {page: page, limit: 15, sort: {created_at : -1}}, function (err, results) {
            if (err)
                throw err;
            res.render('appointment', {userID: req.user.user_userID, appointment: results.docs, page: page});
        })
    });

    router.get('/add_appointment', checkLogin, function (req, res) {
        res.render('add_appointment', {userID: req.user.user_userID, modify: false, appointment: null});
    });

    router.get('/end_appointment', checkLogin, function (req, res) {
        const database = req.app.get('database');
        const page = req.query.page ? req.query.page : 1;

        database.AppointmentModel.paginate({
            'ap_is_finished': false
        }, {page: page, limit: 5, sort: {created_at : -1}}, function (err, results) {
            res.render('end_appointment', {userID: req.user.user_userID, appointment: results.docs, page: page});
        });
    });

    router.get('/appointment_num', checkLogin, function (req, res) {
        const database = req.app.get('database');

        database.AppointmentModel.find().count(function (err, count) {
            res.json(count);
        })
    });

    router.get('/appoint_unfinished_num', function (req, res) {
        const database = req.app.get('database');

        database.AppointmentModel.find({
            'ap_is_finished': false
        }).count(function (err, count) {
            res.json(count);
        })
    });

    router.get('/view_appointment', checkLogin, function(req, res){
        res.render('view_appointment', {userID: req.user.user_userID, modify:false});
    });

    router.get('/appointment/:id', checkLogin, function (req, res) {
        const database = req.app.get('database');
        const ap_id = req.params.id;
        const query = req.query.query ? req.query.query : false;

        database.AppointmentModel.findOne({
            'ap_id': ap_id
        }, async function (err, result) {
            if(!query)
                return res.json({ap: result});
            else
                return res.render("view_appointment", {userID: req.user.user_userID, modify:query==="modify", ap: result});
        })
    });

    router.get('/appointment/member/:id', checkLogin, function(req, res){
        const database = req.app.get('database');
        const member_id = req.params.id;
        database.AppointmentModel.find({
            'ap_member_id': member_id
        }, function(err, results){
            res.json(results);
        })
    });

    router.post('/appointment', checkLogin, async function (req, res) {
        const database = req.app.get('database');
        const member_id = req.body.member_id;
        const procedure = JSON.parse(req.body.procedure);
        const date = req.body.date;
        const price = req.body.price;
        const namePhone = await getNamePhone(database, member_id);
        const procedure_name = await convertProcedureName(database, procedure);

        const newAppointment = new database.AppointmentModel({
            'ap_member_id': member_id,
            'ap_member_name': namePhone.member_name,
            'ap_member_phone': namePhone.member_phone,
            'ap_procedure_name': procedure_name,
            'ap_date': date,
            'ap_price': price
        });

        newAppointment.save(function (err) {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
            res.write('<script type="text/javascript">alert("예약이 저장되었습니다.");window.location.reload();</script>');
            res.end();
        })
    });

    router.put('/appointment/:id', checkLogin, async function (req, res) {
        const database = req.app.get('database');
        const query = req.query.query ? req.query.query : false;
        const ap_id = req.params.id;
        const procedure = req.body.procedure? JSON.parse(req.body.procedure) : "";
        const price = req.body.price;
        const real_price = req.body.real_price;
        const method = req.body.method;
        const detail = req.body.detail;
        const blacklist = req.body.blacklist;
        const procedure_name = typeof(procedure)=== "string" ? procedure : await convertProcedureName(database, procedure);

        database.AppointmentModel.findOne({
            'ap_id': ap_id
        }, function (err, result) {
            if(query !== "modify"){
                result.ap_procedure_name = procedure_name;
                result.ap_price = price;
            }
            result.ap_discount_price = real_price;
            result.ap_payment_method = method;
            result.ap_detail = detail;
            result.ap_blacklist = blacklist;
            result.ap_is_finished = true;
            result.save(function (err, result) {
                res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
                if(query !== "modify")
                    res.write('<script type="text/javascript">alert("예약이 마감되었습니다.");window.location.reload();</script>');
                else
                    res.write('<script type="text/javascript">alert("예약이 수정되었습니다.");window.opener.location.reload();window.close();</script>');
                res.end();
            })
        })
    });
};