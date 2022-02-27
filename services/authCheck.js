module.exports = {
	checkAuthenticated: function checkAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect('/login');
	},
	checkNotAuthenticated: function checkNotAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return res.redirect('/');
		}
		next();
	},
};
