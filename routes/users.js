const checkLogin = require('../utils/check_login');

module.exports = function (router, passport) {

    router.get('/user', checkLogin, function (req, res) {
        const database = req.app.get('database');
        const page = req.query.page ? req.query.page : 1;

        database.UserModel.paginate({}, {page: page, limit: 15, sort: {created_at : -1}}, function (err, results) {
            if (err)
                throw err;
            res.render('auth_user', {userID: req.user.user_userID, user: results.docs, page: page});
        })
    });

    router.get('/user/:userID', function (req, res) {
        const userID = req.params.userID;
        const database = req.app.get('database');

        database.UserModel.findOne({
            'user_userID': userID
        }).then((user) => {
            if (user)
                res.json(true);
            else
                res.json(false);
        })
    });

    router.get('/user_num', function (req, res) {
        const database = req.app.get('database');

        database.UserModel.find().count(function (err, count) {
            res.json(count);
        })
    });

    router.get('/login', function (req, res) {
        res.render('login', {err: null});
    });

    router.get('/signup', function (req, res) {
        if (req.user)
            res.redirect('/');
        else
            res.render('signup')
    });

    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    router.post('/signup', function (req, res, next) {
        if (req.body.userID === '' || !req.body.userID || req.body.password === '' || !req.body.password || req.body.name === '' || !req.body.name)
            return res.json({err: "필수 입력 필드 에러"});
        else {
            passport.authenticate('local_signup', {
                failureFlash: true
            }, function (message) {
                if (message === "회원가입 완료!") {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
                    res.write('<script type="text/javascript">alert("회원가입이 완료되었습니다. 가입한 아이디로 로그인 해주세요.");window.location="/";</script>');
                    res.end();
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
                    res.write('<script type="text/javascript">alert("이미 회원가입한 회원입니다. 아이디를 확인 해주세요.");window.location="/";</script>');
                    res.end();
                }
            })(req, res, next);
        }
    });

    router.post('/login', function (req, res) {
        if (req.body.userID === '' || !req.body.userID || req.body.password === '' || !req.body.password)
            return res.json({err: "필수 입력 필드 에러"});
        passport.authenticate('local_login', {
            failureFlash: false
        }, function (err, user, message) {
            if (err)
                throw err;
            if (message === "관리자 로그인 성공" || message === "로그인 성공") {
                req.login(user, function (err) {
                    if (err)
                        throw err;
                    res.redirect('/');
                });
            } else {
                res.render('login', {err: message});
            }
        })(req, res);
    });

    router.put('/withdrawal', function (req, res) {
        if (!req.user)
            return res.json({login: false});

        const database = req.app.get('database');
        const email = req.user.user_email;

        database.UserModel.findOne({
            'user_email': email
        }, function (err, result) {
            if (err)
                throw err;
            result.user_is_unregistered = true;
            result.save(function (err) {
                if (err)
                    throw err;
                req.logout();
                res.json({withdrawal: true});
            })
        })
    });

    router.put('/user/approve/:id', function (req, res) {
        const database = req.app.get('database');
        const userID = req.params.id;

        database.UserModel.findOne({
            'user_id': userID
        }, function(err, result){
            if (err)
                throw err;
            result.user_type = 0;
            result.save(function(err){
                res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
                res.write('<script type="text/javascript">alert("관리자가 승인 되었습니다.");window.location.reload();</script>');
                res.end();
            })
        })
    });

    router.put('/user/disprove/:id', function (req, res) {
        const database = req.app.get('database');
        const userID = req.params.id;

        database.UserModel.findOne({
            'user_id': userID
        }, function(err, result){
            if (err)
                throw err;
            result.user_type = 1;
            result.save(function(err){
                res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
                res.write('<script type="text/javascript">alert("관리자가 승인 취소 되었습니다.");window.location.reload();</script>');
                res.end();
            })
        })
    });
};
