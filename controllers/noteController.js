const createOneNote = async (req, res) => {
	const { head, body } = req.body;
	const noteList = req.user.noteList;
	noteList.unshift({ head, body });
	const { _id, createAt } = noteList[0];
	try {
		await req.user.save();
	} catch (error) {
		res.json({ msg: error.message });
	}
	res.json({ _id, createAt });
};
const getAllNotes = (req, res) => {
	res.json(req.user.noteList);
};
const deleteOneNote = async (req, res) => {
	const _id = req.params._id;
	req.user.noteList = req.user.noteList.filter(note => note._id != _id);
	try {
		await req.user.save();
	} catch (error) {
		res.json({ msg: error.message });
	}
	res.json({});
};
const updateOneNote = () => {};

module.exports = {
	createOneNote,
	getAllNotes,
	deleteOneNote,
	updateOneNote,
};
