import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { upload } from "../middleware/upload";
import { uploadDocument, listDocuments, deleteDocument } from "../controllers/library.controller";

const router = Router();

// Require authentication for all library routes
router.use(authMiddleware);

router.post("/documents/upload", upload.array("files", 5), uploadDocument);
router.get("/documents", listDocuments);
router.delete("/documents/:id", deleteDocument);

export default router;
