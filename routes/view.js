const category = require('../utils/category');
const checkAuth = require('../utils/check_auth');

module.exports = function (router) {

    router.get('/', checkAuth.checkLogin, function (req, res) {
        res.render('index', {userID: req.user.user_userID});
    });

    router.get('/category', checkAuth.checkLogin, function(req, res){
        res.json(category.category);
    })


};