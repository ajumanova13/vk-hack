const w = {
    city: (x) => 5 * x,
    bdate: (x) => 2 * x,
    like: (x) => 10 * x,
    likes_num: (x) => 4. * Math.pow((1. - Math.pow(Math.abs(x * 0.3 - 1), 3)), 3),
    occupation: (x) => 3 * x,
    common_count: (x) => 0.05 * x,
    home_town: (x) => 3 * x
};

module.exports = {
    calcUserRank: function (x) {
        let rank = 0;
        for (let ft in x) {
            if (x.hasOwnProperty(ft) && w.hasOwnProperty(ft)) {
                rank += w[ft](x(ft))
            }
        }
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
        res["likes_num"] = target["likes_num"];
        res["like"] = target["like"];

        return res;
    }
};