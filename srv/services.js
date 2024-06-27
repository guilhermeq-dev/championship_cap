const cds = require("@sap/cds");

module.exports = async (srv) => {

    const db = await cds.connect.to('db');
    const dbe = await db.entities;

}