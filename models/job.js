"use strict"

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for companies. */

class Job {
    /**
     * create a job.
     * if equity is not provided, it will be set to 0 by default
     */
    static async create({title, salary, equity,company_handle})
    {
        const result = await db.query(
            `
            INSERT INTO jobs
            (title, salary, equity, company_handle)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title, salary, equity, company_handle`,
            [title,salary, equity || 0, company_handle]
        );
        const job = result.rows[0];
        return job;
    }
    /**
     * find all companies
     */
static async findAll()
{
    const res = await db.query(
        `
        SELECT id, title, salary, equity, company_handle
        FROM jobs`
    )
    return res.rows;
}
static async get()
{
    const res = await db.query(
        `
        SELECT id, title, salary, equity, company_handle
        FROM jobs
        WHERE `
    )
}

/**
 * update job data!
 * id and company cannot be changed
 */
static async update(id,data)
{
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          title: "title",
          salary:"salary",
          equity:"equity"
        });
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `
        UPDATE jobs 
        SET ${setCols} 
        WHERE id = ${handleVarIdx} 
        RETURNING handle, 
                name, 
                description, 
                num_employees AS "numEmployees", 
                logo_url AS "logoUrl"`;
    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job id: ${id}`);

    return job;
}
  /** Delete given company from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM jobs
           WHERE id = $1
           RETURNING id`,
        [id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No company: ${handle}`);
  }
}


module.exports = Job;
