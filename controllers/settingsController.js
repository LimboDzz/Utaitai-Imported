const getSettings = (req, res) => {
	res.json(req.user.settings);
};
const updateSettings = async (req, res) => {
	const { name, value } = req.body;
	req.user.settings[name] = value;
	try {
		await req.user.save();
		res.json({});
	} catch (error) {
		res.json({ msg: error.message });
	}
};

module.exports = {
	getSettings,
	updateSettings,
};
