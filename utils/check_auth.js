function checkAuth(req, res, next){
    if(!req.user)
        res.redirect('login');
    else if(req.user.user_type !== 0){
        res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
        res.write('<script type="text/javascript">alert("권한이 없습니다.");window.history.back();</script>');
        res.end();
    }
    else
        next();
}

function checkAuthClose(req, res, next){
    if(!req.user)
        res.redirect('login');
    else if(req.user.user_type !== 0){
        res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
        res.write('<script type="text/javascript">alert("권한이 없습니다.");window.close();</script>');
        res.end();
    }
    else
        next();
}

function checkAuthJson(req, res, next){
    if(!req.user)
        res.redirect('login');
    else if(req.user.user_type !== 0){
        res.json(false);
    }
    else
        next();
}

function checkLogin(req, res, next){
    if(!req.user)
        res.redirect('login');
    else if(req.user.user_type !== 0 && req.user.user_type !== 2)
        res.render('login', {err: "auth_fail"});
    else
        next();
}

module.exports.checkLogin = checkLogin;
module.exports.checkAuth = checkAuth;
module.exports.checkAuthClose = checkAuthClose;
module.exports.checkAuthJson = checkAuthJson;