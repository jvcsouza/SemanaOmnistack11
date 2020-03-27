const connection = require("../database/connection");
const { request, response } = require("express");

module.exports = {
  /**
   * @param {request} req
   * @param {response} resp
   */
  async index(req, resp) {
    const { page = 1 } = req.query;

    const [count] = await connection("incidents").count();

    const incidents = await connection("incidents")
      .join("ongs", "ongs.id", "=", "incidents.ong_id")
      .limit(5)
      .offset((page - 1) * 5)
      .select([
        "incidents.*",
        "ongs.name",
        "ongs.whatsapp",
        "ongs.city",
        "ongs.uf"
      ]);

    resp.header("X-Total-Count", count["count(*)"]);

    return resp.json(incidents);
  },

  /**
   * @param {request} req
   * @param {response} resp
   */
  async store(req, resp) {
    const { title, desc, value } = req.body;

    const ong_id = req.headers.authorization;

    const [id] = await connection("incidents").insert({
      title,
      desc,
      value,
      ong_id
    });

    return resp.json({ id });
  },

  /**
   * @param {request} req
   * @param {response} resp
   */
  async delete(req, resp) {
    const { id } = req.params;
    const ong_id = req.headers.authorization;

    const incident = await connection("incidents")
      .where("id", id)
      .select("ong_id")
      .first();

    if (ong_id !== incident.ong_id)
      return resp.status(401).json({ error: "Operation not permitted." });

    await connection("incidents")
      .where("id", id)
      .delete();

    return resp.status(204).send();
  }
};
