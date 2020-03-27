const connection = require("../database/connection");
const { request, response } = require("express");

module.exports = {
  /**
   * @param {request} req
   * @param {response} resp
   */
  async validate(req, resp, next) {
    const ong_id = req.headers.authorization;

    if (!ong_id)
      return resp.status(400).json({
        error: "No ong id founded"
      });

    req.ongId = ong_id;

    next();
  },

  /**
   * @param {request} req
   * @param {response} resp
   */
  async index(req, resp) {
    const incidents = await connection("incidents")
      .where("ong_id", req.ongId)
      .select("*");

    return resp.json(incidents);
  }
};
