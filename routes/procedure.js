const checkLogin = require('../utils/check_login');

module.exports = function (router) {

    router.get('/procedure', checkLogin, function (req, res) {
        const database = req.app.get('database');
        const page = req.query.page ? req.query.page : 1;
        const search = req.query.search ? req.query.search : "";

        database.ProcedureModel.paginate({
            'procedure_name': {$regex: new RegExp(search, "i")}
        }, {page: page, limit: 15, sort: {created_at : -1}}, function (err, results) {
            if (err)
                throw err;
            res.render('procedure', {userID: req.user.user_userID, procedure: results.docs, page: page});
        })
    });

    router.get('/procedure/search', checkLogin, function (req, res) {
        const database = req.app.get('database');
        const name = req.query.name ? req.query.name : "";
        const page = req.query.page ? req.query.page : 1;

        database.ProcedureModel.paginate({'procedure_name': {$regex: new RegExp(name, "i")}}, {page: page, limit: 15, sort: {created_at : -1}}, function (err, results) {
            if(err)
                throw err;
            res.render('search_procedure', {procedure: results.docs, page: page});
        })
    });

    router.get('/add_procedure', checkLogin, function (req, res) {
        res.render('add_procedure', {userID: req.user.user_userID, modify: false, procedure: null});
    });

    router.get('/procedure_num', function (req, res) {
        const database = req.app.get('database');

        database.ProcedureModel.find().count(function (err, count) {
            res.json(count);
        })
    });

    router.get('/procedure/:id', checkLogin, function (req, res) {
        const database = req.app.get('database');
        const procedure_id = req.params.id;
        database.ProcedureModel.findOne({
            'procedure_id': procedure_id
        }, function (err, result) {
            res.render('add_procedure', {userID: req.user.user_userID, modify: true, procedure: result});
        })
    });

    router.post('/procedure', checkLogin, function (req, res) {
        const database = req.app.get('database');
        const name = req.body.name;
        const category = req.body.category;
        const price = req.body.price;

        const newProcedure = new database.ProcedureModel({
            'procedure_name': name,
            'procedure_category': category,
            'procedure_price': price
        });

        newProcedure.save(function (err) {
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
            res.write('<script type="text/javascript">alert("시술이 저장되었습니다.");window.opener.location.reload();window.close();</script>');
            res.end();
        })
    });

    router.put('/procedure/:id', checkLogin, function (req, res) {
        const database = req.app.get('database');
        const procedure_id = req.params.id;
        const name = req.body.name;
        const category = req.body.category;
        const price = req.body.price;

        database.ProcedureModel.findOne({
            'procedure_id': procedure_id
        }, function (err, result) {
            result.procedure_name = name;
            result.procedure_category = category;
            result.procedure_price = price;
            result.save(function (err) {
                res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
                res.write('<script type="text/javascript">alert("시술이 수정되었습니다.");window.opener.location.reload();window.close();</script>');
                res.end();
            })
        })
    });

    router.delete('/procedure/:id', checkLogin, function (req, res) {
        const database = req.app.get('database');
        const procedure_id = req.params.id;

        database.ProcedureModel.deleteOne({
            'procedure_id': procedure_id
        }, function (err) {
            if (err)
                throw err;
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
            res.write('<script type="text/javascript">alert("시술이 삭제되었습니다.");window.location.reload();</script>');
            res.end();
        });
    })
};