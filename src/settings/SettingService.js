App.factory('SettingService', function ($q, Common) {

    var db = Common.getConnection();

    return {
        search: function (query) {
            var q = $q.defer();

            db('hospcode')
                .select('hospcode', 'hosptype', 'name')
                .where('name', 'like', '%' + query + '%')
                .orWhere('hospcode', query)
                .limit(10)
                .exec(function (err, rows) {
                    if (err) q.reject(err);
                    else q.resolve(rows);
                });

            return q.promise;
        }
    };

});