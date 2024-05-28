const chats = [
  {
    id: 1,
    channel_id: 'channel_1',
    type: 'single',
    users: [1, 3],
  },
  {
    id: 2,
    channel_id: 'channel_2',
    type: 'single',
    users: [1, 4],
  },
  {
    id: 5,
    channel_id: 'channel_3',
    type: 'single',
    users: [3, 4],
  },
  {
    id: 6,
    channel_id: 'channel_4',
    type: 'group',
    users: [],
  },
];

module.exports = {
  chats,
};
