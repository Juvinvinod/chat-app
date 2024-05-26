const tokenGenerator = require('../utils/tokenGenerator');
const dummyData = require('../dummyData');

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
    res.status(200).json(dummyData);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  login,
  getUsers,
};
