"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.theatreRouter = void 0;
const express_1 = __importDefault(require("express"));
const VerifyUserRoleToken_1 = require("../../middleware/VerifyUserRoleToken");
const theatre_controller_1 = require("../../controllers/api/theatre.controller");
const theatreRouter = express_1.default.Router();
exports.theatreRouter = theatreRouter;
/**
 * @swagger
 * tags:
 *   name: Theatre
 *   description: Theatre management APIs
 */
/**
 * @swagger
 * /theatre/create-theatre:
 *   post:
 *     summary: Create a new theatre
 *     tags: [Theatre]
 *     description: |
 *       Admin-only route.
 *       Creates a theatre with name, location, and seating capacity.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - totalSeats
 *             properties:
 *               name:
 *                 type: string
 *                 example: "PVR Cinemas"
 *               location:
 *                 type: string
 *                 example: "Kolkata, Salt Lake"
 *               totalSeats:
 *                 type: number
 *                 example: 150
 *     responses:
 *       201:
 *         description: Theatre created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (admin only)
 */
// get method [get] for getting user profile
theatreRouter.post('/create-theatre', (0, VerifyUserRoleToken_1.verifyUserRoleToken)(["admin"]), theatre_controller_1.theatreController.createTheatre);
/**
 * @swagger
 * /theatre/get-theatres:
 *   get:
 *     summary: Get all theatres
 *     tags: [Theatre]
 *     description: |
 *       Admin-only route.
 *       Fetches the list of all theatres.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Theatres fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "65df90b123a4c9ff12a5e890"
 *                   name:
 *                     type: string
 *                     example: "INOX City Centre"
 *                   location:
 *                     type: string
 *                     example: "Salt Lake, Kolkata"
 *                   movies:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - "65df2bf109a4c9ff01a3e880"
 *                       - "65df2bf109a4c9ff01a3e881"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */
// get method [get] for getting all theatres
theatreRouter.get('/get-theatres', (0, VerifyUserRoleToken_1.verifyUserRoleToken)(["admin"]), theatre_controller_1.theatreController.getAllTheatres);
/**
 * @swagger
 * /theatre/assign-movies/{theatreId}:
 *   patch:
 *     summary: Assign movies to a theatre
 *     tags: [Theatre]
 *     description: |
 *       Admin-only route.
 *       Assigns one or more movie IDs to a theatre.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: theatreId
 *         required: true
 *         schema:
 *           type: string
 *           example: "65df90b123a4c9ff12a5e890"
 *         description: Theatre ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieIds
 *             properties:
 *               movieIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - "65df2bf109a4c9ff01a3e880"
 *                   - "65df2bf109a4c9ff01a3e881"
 *     responses:
 *       200:
 *         description: Movies assigned to theatre successfully
 *       400:
 *         description: Invalid theatre or movie IDs
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */
// assign movies to theatre
theatreRouter.patch('/assign-movies/:theatreId', (0, VerifyUserRoleToken_1.verifyUserRoleToken)(["admin"]), theatre_controller_1.theatreController.assignMoviesToTheatre);
