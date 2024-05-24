const tokenGenerator = require('../utils/tokenGenerator');
const dummyData = require('../dummyData');

const login = (req, res) => {
  try {
    const { username, password } = req.body;
    const user = dummyData.users.find(
      (u) => u.username === username && u.password === password,
    );

    if (user) {
      const token = tokenGenerator(user.id);

      res.status(200).json({ token, user });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  login,
};
