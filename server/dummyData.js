// Mock users
const users = [
  {
    id: 1,
    email: 'admin@gmail.com',
    name: 'Admin',
    password: 'admin',
    role: 'admin',
    type: 'user',
  },
  {
    id: 2,
    email: 'user@gmail.com',
    name: 'User',
    password: 'user',
    role: 'user',
    type: 'user',
  },
  {
    id: 3,
    email: 'juvin@gmail.com',
    name: 'Juvin',
    password: 'user',
    role: 'admin',
    type: 'user',
  },
  {
    id: 4,
    email: 'arun@gmail.com',
    name: 'Arun',
    password: 'user',
    role: 'admin',
    type: 'user',
  },
  {
    id: 5,
    email: '',
    name: 'Group',
    password: '',
    role: '',
    type: 'group',
  },
];

module.exports = {
  users,
};
