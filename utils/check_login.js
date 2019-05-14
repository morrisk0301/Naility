function checkLogin(req, res, next){
    if(!req.user)
        res.redirect('login');
    else if(req.user.user_type !== 0)
        res.render('login', {err: "auth_fail"});
    else
        next();
}

module.exports = checkLogin;