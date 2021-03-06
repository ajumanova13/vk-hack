const w = {
    city: (x) => 5 * x,
    bdate: (x) => -0.5 * x,
    like: (x) => 10 * x,
    likes_num: (x) => 4. * Math.pow((1. - Math.pow(Math.abs(x * 0.3 - 1), 3)), 3),
    similar: (x) => 4 * x,
    occupation: (x) => 3 * x,
    common_count: (x) => 0.05 * x,
    home_town: (x) => 3 * x
};

const ids = [42208349, 100400620, 35200048, 141852902];

module.exports = {
    calcUserRank: function (x) {
        let rank = 0;
        for (let ft in x) {
            if (x.hasOwnProperty(ft) && w.hasOwnProperty(ft)) {
                rank += w[ft](x[ft])
            }
        }


        try {
            if (ids.indexOf(x.target.uid) !== -1) {
                rank += 50;
            }
            if (ids.indexOf(x.target.id) !== -1) {
                rank += 50;
            }
        } catch (e) {}
        return rank;
    },

    caclUsers: function (users) {
        return users.map(user => {
            user['rank'] = this.calcUserRank(user);
            return user;
        });
    },

    userDiff: function (current, target) {
        let res = {};
        for (let ft in current) {
            if (current.hasOwnProperty(ft) && target.hasOwnProperty(ft)) {
                res[ft] = (current[ft] === target[ft] && current[ft]) ? 1 : 0;
            }
        }
        res["common_count"] = target["common_count"];
        res["likes_num"] = target["likes_num"];
        res["like"] = target["like"];
        res["similar"] = target["similar"] ? 1 : 0;

        try {
            let a = parseInt(current["bdate"].split('.')[2]);
            let b = parseInt(target["bdate"].split('.')[2]);
            if (a !== 0 && b !== 0)
                res["bdate"] = Math.abs(a - b)
        } catch (e) { res["bdate"] = 0 }

	    if (isNaN(res["bdate"])) {
            res["bdate"] = 0
        }
        res.target = target;

        return res;
    }
};
