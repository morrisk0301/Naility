const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
    usernameField: 'userID',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, userID, password, done) {
    const paramName = req.body.name;

    process.nextTick(function () {
        const database = req.app.get('database');

        database.UserModel.findOne({'user_userID': userID}, async function (err, user) {
            // 에러 발생 시
            if (err)
                throw err;
            if (user) {
                return done('이미 회원가입 유저 에러');
            } else {
                const newUser = new database.UserModel({
                    'user_userID': userID, 'password': password, 'user_name': paramName,
                });

                newUser.save(function (err) {
                    return done('회원가입 완료!');
                })
            }
        })
    })
});
