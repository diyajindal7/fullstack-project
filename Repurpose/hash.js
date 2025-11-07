const bcrypt = require('bcrypt');

bcrypt.hash('admin123', 10)
  .then(hash => {
    console.log(hash); // copy this output
  })
  .catch(err => console.error(err));
