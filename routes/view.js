const category = require('../utils/category');
const checkLogin = require('../utils/check_login');

module.exports = function (router) {

    router.get('/', checkLogin, function (req, res) {
        res.render('index', {userID: req.user.user_userID});
    });

    router.get('/category', checkLogin, function(req, res){
        res.json(category.category);
    })


};