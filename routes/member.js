const checkAuth = require('../utils/check_auth');

function checkExistance(database, name, phone){
    return new Promise(function(resolve, reject){
        database.MemberModel.findOne({
            'member_name': name,
            'member_phone': phone
        }, function(err, result){
            console.log(err, result);
            if(result)
                resolve(true);
            else
                resolve(false);
        })
    })
}

module.exports = function (router) {

    router.get('/member', checkAuth.checkLogin, function (req, res) {
        const database = req.app.get('database');
        const page = req.query.page ? req.query.page : 1;
        const search = req.query.search ? req.query.search : "";
        const query = req.query.query;
        const searchQuery = query === "name" ? {'member_name': {$regex: new RegExp(search, "i")}} : {'member_phone': {$regex: new RegExp(search, "i")}};

        database.MemberModel.paginate(searchQuery, {
            page: page,
            limit: 5,
            sort: {created_at: -1}
        }, function (err, results) {
            if (err)
                throw err;
            res.render('member', {
                userID: req.user.user_userID,
                member: results.docs,
                page: page,
                num: results.total
            });
        })
    });

    router.get('/member_num', checkAuth.checkLogin, function (req, res) {
        const database = req.app.get('database');
        database.MemberModel.find({}).count(function (err, result) {
            res.json(result);
        })
    });

    router.get('/member/search', checkAuth.checkLogin, function (req, res) {
        const database = req.app.get('database');
        const name = req.query.name ? req.query.name : "";
        const type = req.query.type;
        const page = req.query.page ? req.query.page : 1;
        const query = req.query.query ? req.query.query : "";
        let render = query === 'ap' ? 'search_member' : 'search_membership';

        const searchQuery = type ==="이름" ? {'member_name': {$regex: new RegExp(name, "i")}} : {'member_phone': {$regex: new RegExp(name, "i")}};

        database.MemberModel.paginate(searchQuery, {
            page: page,
            limit: 5,
            sort: {created_at: -1}
        }, function (err, results) {
            if (err)
                throw err;
            res.render(render, {
                member: results.docs,
                page: page,
                query: query,
                num: results.total,
            });
        })
    });

    router.get('/add_member', checkAuth.checkLogin, function (req, res) {
        const ap = req.query.ap ? req.query.ap : false;
        res.render('add_member', {userID: req.user.user_userID, modify: false, member: [], ap: ap});
    });

    router.get('/member/:id', checkAuth.checkAuthClose, function (req, res) {
        const database = req.app.get('database');
        const member_id = req.params.id;
        database.MemberModel.findOne({
            'member_id': member_id
        }, function (err, result) {
            res.render('add_member', {userID: req.user.user_userID, modify: true, member: result, ap: false});
        })
    });

    router.post('/member', checkAuth.checkAuth, async function (req, res) {
        const database = req.app.get('database');
        const name = req.body.name;
        const phone = req.body.phone;
        const contact = req.body.contact;
        const ap = req.body.ap !== 'false';

        const isExist = await checkExistance(database, name, phone);
        if(isExist){
            process.nextTick(function(){
                if(!ap){
                    res.json({exist: true, ap: false});
                }else{
                    res.json({exist: true, ap: true});
                }
            })
        }
        else {
            const newMember = new database.MemberModel({
                'member_name': name,
                'member_phone': phone,
                'member_contact': contact
            });

            newMember.save(function (err, save_result) {
                if (!ap) {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
                    res.write('<script type="text/javascript">alert("회원이 저장되었습니다.");window.opener.location.reload();window.close();</script>');
                    res.end();
                } else
                    res.json({member_id: save_result.member_id, ap: true});
            })
        }
    });

    router.put('/member/:id', checkAuth.checkAuth, function (req, res) {
        const database = req.app.get('database');
        const member_id = req.params.id;
        const name = req.body.name;
        const phone = req.body.phone;
        const contact = req.body.contact;

        database.MemberModel.findOne({
            'member_id': member_id
        }, function (err, result) {
            result.member_name = name;
            result.member_phone = phone;
            result.member_contact = contact;
            result.save(function (err) {
                res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
                res.write('<script type="text/javascript">alert("회원이 수정되었습니다.");window.opener.location.reload();window.close();</script>');
                res.end();
            })
        })
    });


};