import express from "express";

import protect from "../middleware/auth.js";

import {

    saveVersion,

    getVersions,

    restoreVersion

} from "../controllers/version.controller.js";

const router = express.Router();

router.use(protect);

router.post("/:id/save",saveVersion);

router.get("/:id/history",getVersions);

router.post("/:id/restore/:versionId",restoreVersion);

export default router;