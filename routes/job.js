"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureLoggedIn, isAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Job = require("../models/job");
const { createToken } = require("../helpers/tokens");
const jobNewSchema = require("../schemas/jobNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/**
 * adding a new job
 */
router.post("/", isAdmin, async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, jobNewSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const res = await Job.create(req.body);
      return res.status(201).json({res});
    } catch (err) {
      return next(err);
    }
  });
  
  
  /** GET / => { users: [ {username, firstName, lastName, email }, ... ] }
   *
   * Returns list of all users.
   *
   * Authorization required: login
   **/
  
  router.get("/", isAdmin, async function (req, res, next) {
    try {
      const res = await Job.findAll();
      return res.json({ res });
    } catch (err) {
      return next(err);
    }
  });
  
  
  /** PATCH /[username] { user } => { user }
   *
   * Data can include:
   *   { firstName, lastName, password, email }
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Authorization required: login
   **/
  
  router.patch("/:username", ensureLoggedIn, async function (req, res, next) {
    try {
      isPermittedUser(res.locals.user,req.params.username);
      const validator = jsonschema.validate(req.body, userUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const user = await User.update(req.params.username, req.body);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  });
  
  
  /** DELETE /[username]  =>  { deleted: username }
   *
   * Authorization required: login
   **/
  
  router.delete("/:username", ensureLoggedIn, async function (req, res, next) {
    try {
      isPermittedUser(res.locals.user,req.params.username);
      await User.remove(req.params.username);
      return res.json({ deleted: req.params.username });
    } catch (err) {
      return next(err);
    }
  });
  
  
  module.exports = router;
  