var db = require("../models");

module.exports = function (app) {
  // Get all examples
  app.get("/api/examples", function (req, res) {
    db.Example.findAll({}).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function (req, res) {
    db.Example.create(req.body).then(function (dbExample) {
      console.log(dbExample);
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function (req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function (
      dbExample
    ) {
      res.json(dbExample);
    });
  });

  app.post("/users/login", function (req, res) {
    console.log(req.body);

    db.User.findOne({
      raw: true,
      where: { email: req.body.email }
    }).then(function (user) {
      console.log(user);
      if (!user) {
        // res.json({ error: "No User found!" })
        res.render("login", { emailErr: true })
      }
      else if (user.password !== req.body.password) {
        // res.json({ error: "Password is incorrect" })
        res.render("login", { passwordErr: true })
      } else {
        res.redirect("/");
      }

    });
  });

  app.post("/users/register", function (req, res) {
    db.User.create(req.body).then(function (result) {
      console.log(result);
      res.redirect("/");
    });
  });
};
