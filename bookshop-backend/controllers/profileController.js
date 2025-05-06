// profileController.js
module.exports = {
    getProfile(req, res) {
      res.json({ message: `Welcome ${req.user.email}! This is protected data.` });
    }
  };
  