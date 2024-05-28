const tokenGenerator = require('../utils/tokenGenerator');
const dummyData = require('../dummyData');
const chatData = require('../chatData');

const login = (req, res) => {
  try {
    const { email, password } = req.body;
    const user = dummyData.users.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      const token = tokenGenerator(user.id);
      res.status(200).json({ token, ...user });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUsers = (req, res) => {
  try {
    const filteredData = dummyData.users.filter((doc) => doc.role !== 'user');
    res.status(200).json(filteredData);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getChatDetails = (req, res) => {
  try {
    const sender = Number(req.query.sender);
    const reciever = Number(req.query.reciever);
    const { type } = req.query;
    if (type === 'single') {
      const filteredData = chatData.chats.filter(
        (doc) => doc.users.includes(sender) && doc.users.includes(reciever),
      );
      res.status(200).json(filteredData[0].channel_id);
    } else {
      const filteredData = chatData.chats.filter((doc) => doc.type === 'group');
      res.status(200).json(filteredData[0].channel_id);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  login,
  getUsers,
  getChatDetails,
};
