const checkLogin = require('../utils/check_login');

module.exports = function (router) {

    router.get('/member', checkLogin, function (req, res) {
        const database = req.app.get('database');
        const page = req.query.page ? req.query.page : 1;
        const search = req.query.search ? req.query.search : "";
        const query = req.query.query;
        const searchQuery = query === "name" ? {'member_name': {$regex: new RegExp(search, "i")}} : {'member_phone': {$regex: new RegExp(search, "i")}};

        database.MemberModel.paginate(searchQuery, {page: page, limit: 5, sort: {created_at : -1}}, function (err, results) {
            if (err)
                throw err;
            res.render('member', {userID: req.user.user_userID, member: results.docs, page: page});
        })
    });

    router.get('/member/search', checkLogin, function (req, res) {
        const database = req.app.get('database');
        const name = req.query.name ? req.query.name : "";
        const page = req.query.page ? req.query.page : 1;

        database.MemberModel.paginate({'member_name': {$regex: new RegExp(name, "i")}}, {page: page, limit: 15, sort: {created_at : -1}}, function (err, results) {
            if(err)
                throw err;
            res.render('search_member', {member: results.docs, page: page});
        })
    });

    router.get('/add_member', checkLogin, function (req, res) {
        const ap = req.query.ap ? req.query.ap : false;
        res.render('add_member', {userID: req.user.user_userID, modify: false, member: null, ap: ap});
    });

    router.get('/member_num', function (req, res) {
        const database = req.app.get('database');

        database.MemberModel.find().count(function (err, count) {
            res.json(count);
        })
    });

    router.get('/member/:id', checkLogin, function (req, res) {
        const database = req.app.get('database');
        const member_id = req.params.id;
        database.MemberModel.findOne({
            'member_id': member_id
        }, function (err, result) {
            res.render('add_member', {userID: req.user.user_userID, modify: true, member: result, ap: false});
        })
    });

    router.post('/member', checkLogin, function (req, res) {
        const database = req.app.get('database');
        const name = req.body.name;
        const phone = req.body.phone;
        const ap = req.body.ap;
        const membership = req.body.membership;

        const newMember = new database.MemberModel({
            'member_name': name,
            'member_phone': phone,
            'member_membership': membership
        });

        newMember.save(function (err, save_result) {
            if(!ap){
                res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
                res.write('<script type="text/javascript">alert("회원이 저장되었습니다.");window.opener.location.reload();window.close();</script>');
                res.end();
            }
            else
                res.json(save_result.member_id);
        })
    });

    router.put('/member/:id', checkLogin, function (req, res) {
        const database = req.app.get('database');
        const member_id = req.params.id;
        const name = req.body.name;
        const phone = req.body.phone;
        const membership = req.body.membership;

        database.MemberModel.findOne({
            'member_id': member_id
        }, function (err, result) {
            result.member_name = name;
            result.member_phone = phone;
            result.member_membership = membership;
            result.save(function (err) {
                res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
                res.write('<script type="text/javascript">alert("회원이 수정되었습니다.");window.opener.location.reload();window.close();</script>');
                res.end();
            })
        })
    });

    router.delete('/member/:id', checkLogin, function (req, res) {
        const database = req.app.get('database');
        const member_id = req.params.id;

        database.MemberModel.deleteOne({
            'member_id': member_id
        }, function (err) {
            if (err)
                throw err;
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
            res.write('<script type="text/javascript">alert("회원 삭제되었습니다.");window.location.reload();</script>');
            res.end();
        });
    })


};