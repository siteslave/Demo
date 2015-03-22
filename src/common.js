App.factory('Common', function () {

    var config = jf.readFileSync(configFile);

    return {
        getConnection: function () {
            return require('knex')({
                client: 'mysql',
                connection: config.db,
                pool: {
                    min: 0,
                    max: 1000
                },
                charset: 'utf8'
            });
        }
    };

});