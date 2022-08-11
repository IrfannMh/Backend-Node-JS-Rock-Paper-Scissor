const express = require("express");
const authController = require("./controllers/authController");
const roomController = require("./controllers/roomController");
const auth = require("./middlewares/auth");
const router = express.Router();
const role = require("./middlewares/role");

// API GAME
router.get("/api/v1/user",authController.getAllUser);
router.post("/api/v1/user/login", authController.login);
router.post("/api/v1/user/signup", authController.register);
router.get("/api/v1/user/me", auth, role(['user']),authController.whoami);
router.get("/api/v1/room", roomController.getAll);
router.post("/api/v1/room/create",auth, role(['user']),roomController.createRoom);
router.post("/api/v1/room/join/:id",auth, role(['user']),roomController.join);
router.post("/api/v1/room/fight/:id", auth, role(['user']), roomController.play);
router.get("/api/v1/room/:id/result", auth, role(['user']), roomController.resultGame)
router.get("/api/v1/room/result", roomController.allResult);

module.exports = router;