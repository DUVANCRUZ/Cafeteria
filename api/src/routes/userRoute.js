const { Router } = require("express");
const userRoute = Router();
const { getUser, postUser } = require("./middleware/userFunct");

userRoute.post("/", async (req, res) => {
  const {
    name,
    lastName,
    image,
    mail,
    password,
    age,
    address,
    favorite,
    shoppingHistory,
  } = req.body;
  try {
    await postUser(
      name,
      lastName,
      image,
      mail,
      password,
      age,
      address,
      favorite,
      shoppingHistory
    );
    res.status(200).send({ message: "Usuario creado con exito" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({ error: "El usuario ya existe" });
    } else {
      res.status(500).send({ error: "Error al crear el usuario" });
    }
  }
});

module.exports = userRoute;
