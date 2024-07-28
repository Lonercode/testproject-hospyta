import express from 'express';
import protect from '../middlewares/user.middlewares';
import uploads from '../middlewares/image.middlewares';

const router = express.Router();

import {
    signUp,
    confirm,
    login,
    forgotPassword,
    resetPassword,
    confirmReset,
    expiredRegLink
} from '../controllers/auth.controllers';

import { 
    getAllEntries,
    getEntries, 
    getEntry, 
    createEntry, 
    updateEntry, 
    deleteEntry,
    upvoteEntry,
    downvoteEntry,
    getPostsSorted
} from '../controllers/posts.controllers';

import {
    addComment,
    replyToComment,
    getPostComments
} from '../controllers/comments.controllers';



router.post("/register", signUp)
router.get("/verifyAccount", protect, confirm)
router.post("/renewLink", expiredRegLink)
router.post("/login", login)
router.post("/forgotPassword", forgotPassword)
router.get("/confirmReset", protect, confirmReset)
router.post("/resetPassword", protect, resetPassword)

//Entry/Posts routes for authorized users

router.get("/allEntries", protect, getAllEntries)
router.get("/myEntries", protect, getEntries)
router.get("/myEntry", protect, getEntry)
router.post("/createEntry", protect, uploads.single('image'), createEntry)
router.put("/updateEntry", protect, uploads.single('image'), updateEntry)
router.delete("/deleteEntry", protect, deleteEntry)
router.post("/entries/:id/upvote", protect, upvoteEntry);
router.post("/entries/:id/downvote", protect, downvoteEntry);
router.get("/entries/sorted", protect, getPostsSorted )

//Comment routes for authorized users

router.post("/addComments", protect, addComment)
router.post("/replyComments", protect, replyToComment)
router.get("/comments/:postId", getPostComments);



export default router