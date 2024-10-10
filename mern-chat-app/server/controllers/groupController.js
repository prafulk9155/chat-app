const Group = require('../models/Group');

const createGroup = async (req, res) => {
    const { groupName, members } = req.body;

    const newGroup = new Group({ groupName, members });
    try {
        await newGroup.save();
        res.status(201).json(newGroup);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

module.exports = { createGroup };
