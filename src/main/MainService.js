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
                    'ed.bba', 'ed.dba', 'ed.psychic')
                .innerJoin('ovst as o', 'o.vn', 'ed.vn')
                .innerJoin('patient as p', 'o.hn', 'p.hn')
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
        }

    };

});