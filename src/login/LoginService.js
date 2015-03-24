App.factory('LoginService', function ($q, Common) {

    var db = Common.getConnection();

    return {

        login: function (username, password) {
            var q = $q.defer();
            var crypto = require('crypto');

            var encryptPass = crypto.createHash('md5')
                .update(password).digest('hex');

            // SELECT username, fullname FROM users WHERE username=? and password=?
            db('users')
                .select('username', 'fullname')
                .where('username', username)
                .where('password', encryptPass)
                .exec(function (err ,rows) {
                    if (err) q.reject(err);
                    else q.resolve(rows);
                });

            return q.promise;

        },

        getHospital: function () {
            var q = $q.defer();

            db('opdconfig')
                .select('hospitalname', 'hospitalcode')
                .limit(1)
                .exec(function (err, rows) {
                    if (err) q.reject(err);
                    else q.resolve(rows[0]);
                });

            return q.promise;
        }

    };

});