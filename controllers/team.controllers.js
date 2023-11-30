const Team = require("../models/team");

exports.findAll = (req, res) => {
  const id = req.query.id;
  const conditionForQuery = id
    ? { $regex: new RegExp(id), $options: "gi" }
    : {};

  Team.find(conditionForQuery)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err.message);
    });
};
