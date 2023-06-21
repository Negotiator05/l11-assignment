import { RequestHandler } from "express";
import { Bookmark } from "../models/bookmark";
import { User } from "../models/user";
import { verifyUser } from "./services/auth";

export const getAllBookmarks: RequestHandler = async (req, res, next) => {
    let bookmarks = await Bookmark.findAll();
    res.status(200).json(bookmarks);
}

export const createBookmark: RequestHandler = async (req, res, next) => {
    let user: User | null = await verifyUser(req);

    if (!user) {
        return res.status(403).send();
    }
    
    let newBookmark: Bookmark = req.body;
    if (newBookmark.title && newBookmark.url) {
        newBookmark.userId = user.userId; // Set the userId for the new bookmark
        let created = await Bookmark.create(newBookmark);
        res.status(201).json(created);
    }
    else {
        res.status(400).send();
    }
}

export const getBookmark: RequestHandler = async (req, res, next) => {
    let bookmarkId = req.params.id;
    let bookmark = await Bookmark.findByPk(bookmarkId);
    if (bookmark) {
        res.status(200).json(bookmark);
    }
    else {
        res.status(404).json({});
    }
}

export const updateBookmark: RequestHandler = async (req, res, next) => {
    const bookmarkId = req.params.bookmarkId;
    const updatedBookmark: Bookmark = req.body;
    
    const bookmarkFound = await Bookmark.findByPk(bookmarkId);
    
    if (bookmarkFound) {
        if (updatedBookmark.title && updatedBookmark.url) {
            try {
                await Bookmark.update(updatedBookmark, {
                    where: { bookmarkId: bookmarkId }
                });
                res.status(200).json();
            } catch (error) {
                console.error('Error updating bookmark:', error);
                res.status(500).json({ error: 'Failed to update the bookmark' });
            }
        } else {
            res.status(400).json({ error: 'Invalid bookmark data. Title and URL are required.' });
        }
    } else {
        res.status(404).json({ error: 'Bookmark not found' });
    }
};



export const deleteBookmark: RequestHandler = async (req, res, next) => {
    let bookmarkId = req.params.id;
    let found = await Bookmark.findByPk(bookmarkId);
    
    if (found) {
        await Bookmark.destroy({
                where: { bookmarkId: bookmarkId }
        });
        res.status(200).json();
    }
    else {
        res.status(404).json();
    }
}