/**
 * Main Service
 */
App.factory('MainService', function ($q, Common) {

    var db = Common.getConnection();

    return {

        getData: function (startDate, endDate) {
            var q = $q.defer();
            /*
             select o.vstdate, o.vsttime, o.hn, o.vn, p.cid,
             p.pname, p.fname, p.lname, p.birthday, p.sex,
             ed.bba, ed.dba, ed.psychic

             from er_nursing_detail as ed
             inner join ovst as o on o.vn=ed.vn
             inner join patient as p on p.hn=o.hn
             where o.vstdate between '2014-08-01' and '2014-09-30'
             order by o.vstdate
             */
            db('er_nursing_detail as ed')
                .select('o.vstdate', 'o.vsttime', 'o.hn', 'o.vn', 'p.cid',
                    'p.pname', 'p.fname', 'p.lname', 'p.birthday', 'p.sex',
                    'ed.bba', 'ed.dba', 'ed.psychic', 'l.exported_date')
                .innerJoin('ovst as o', 'o.vn', 'ed.vn')
                .innerJoin('patient as p', 'o.hn', 'p.hn')
                .leftJoin('nemo_send_logs as l', 'l.vn', 'ed.vn')
                .whereBetween('o.vstdate', [startDate, endDate])
                .orderBy('o.vstdate')
                .exec(function (err, rows) {
                    if (err) q.reject(err);
                    else q.resolve(rows);
                });

            return q.promise;
        },

        saveMap: function (vn, lat, lng) {
            var q = $q.defer();
            db('nemo_maps')
                .insert({
                    vn: vn,
                    lat: lat,
                    lng: lng
                })
                .exec(function (err) {
                    if (err) q.reject(err);
                    else q.resolve();
               });

            return q.promise;
        },

        saveLog: function (data) {
            var q = $q.defer();

            db('nemo_send_logs')
                .insert(data)
                .exec(function (err) {
                    if (err) q.reject(err);
                    else q.resolve();
                });

            return q.promise;
        },

        sendRecord: function (data) {
            var knex = require('knex')({
                client: 'mysql',
                connection: {
                    host: 'localhost',
                    port: 3306,
                    database: 'nemo',
                    user: 'sa',
                    password: 'sa'
                },
                pool: {
                    min: 0,
                    max: 100
                },
                debug: true
            });

            var q = $q.defer();

            knex('accident')
                .insert(data)
                .exec(function (err) {
                    if (err) q.reject(err);
                    else q.resolve();
                });

            return q.promise;
        },

        sendData: function (file) {
            var q = $q.defer();
            var knex = require('knex')({
                client: 'mysql',
                connection: {
                    host: 'localhost',
                    port: 3306,
                    database: 'nemo',
                    user: 'sa',
                    password: 'sa'
                },
                pool: {
                    min: 0,
                    max: 100
                },
                debug: true
            });

            var currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');

            knex.raw(
                "LOAD DATA LOCAL INFILE ? REPLACE INTO TABLE accident FIELDS TERMINATED BY '|' LINES TERMINATED BY '\n' IGNORE 1 ROWS (hospcode, @vstdate, @vsttime, hn,vn, cid, pname, fname, lname, @birth, sex, bba, dba, psychic, @updated_at) SET vstdate=STR_TO_DATE(@vstdate, '%Y%m%d'), vsttime=STR_TO_DATE(@vsttime, '%H%i%s'), birth=STR_TO_DATE(@birth, '%Y%m%d'), updated_at=?;", [file, currentDateTime])
                .then(function() {
                    q.resolve();
                }, function (err) {
                    console.log(err);
                    q.reject(err);
                });

            return q.promise;
        }

    };

});