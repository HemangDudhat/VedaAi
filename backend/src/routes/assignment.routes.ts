import { Router } from "express";
import {
  createAssignment,
  listAssignments,
  getAssignment,
  deleteAssignment,
  regenerateAssignment,
  uploadFile,
} from "../controllers/assignment.controller";
import { validate } from "../middleware/validate";
import { createAssignmentSchema } from "../validators/assignment.validator";
import { upload } from "../middleware/upload";

const router = Router();

// --- Assignment CRUD ---
router.post("/", validate(createAssignmentSchema), createAssignment);
router.get("/", listAssignments);
router.get("/:id", getAssignment);
router.delete("/:id", deleteAssignment);

// --- Regenerate ---
router.post("/:id/regenerate", regenerateAssignment);

// --- File Upload ---
router.post("/upload", upload.array("files", 5), uploadFile);

export default router;
