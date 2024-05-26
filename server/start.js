const httpServer = require('./app');

require('dotenv').config();

const PORT = 3050; // assign a port for server

// app.listen(PORT, () => {
//   console.log('Server running on PORT', PORT);
// });

httpServer.listen(PORT, () => console.log('Server running on PORT', PORT));
