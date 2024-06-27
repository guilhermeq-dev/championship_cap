const cds = require('@sap/cds');

module.exports = async (srv) => {

    const db = await cds.connect.to('db');
    const dbe = db.entities;

    srv.before('CREATE', 'Matches', async (req) => {

        const { team_1_ID, team_2_ID, date, stadium, championship_ID } = req.data;
        
        const team1 = await SELECT.one().from(dbe.Teams).where({ ID: team_1_ID });
        const team2 = await SELECT.one().from(dbe.Teams).where({ ID: team_2_ID });
        const championship = await SELECT.one().from(dbe.Championships).where({ ID: championship_ID });

        if(!team1 || !team2 || !championship) {
            return req.error(404, "Time ou campeonato não encontrado.");
        };
        
        if(team_1_ID === team_2_ID) {
            return req.error(400, "Não é possível criar uma partida entre o mesmo time.");
        };
        
        const sDate = new Date().toISOString();
        
        if(date <= sDate) {
            return req.error(400, "Data da partida inválida.")
        };

        const existingMatch = await SELECT.one().from(dbe.Matches).where({ date, stadium });

        if(existingMatch) {
            return req.error(400, 'Já existe uma partida agendada para este horário nesse estádio.');
        };

        console.log(`Partida entre ${team1.team_name} e ${team2.team_name} no estádio ${stadium} está valida.`);

        return req.data;
    });

    srv.on('CREATE', 'Matches', async (req) => {
        const { ID, team_1_ID, team_2_ID, date, stadium, championship_ID } = req.data;

        await INSERT([{
            ID: ID,
            team_1_ID: team_1_ID,
            team_2_ID: team_2_ID,
            date: date,
            stadium: stadium,
            championship_ID: championship_ID
        }]).into(dbe.Matches)

        const match = await SELECT.one().from(dbe.Matches).where({ ID: ID });

        console.log(match)

        return match
    });

    srv.after('CREATE', 'Matches', async (req) => {
        return console.log(`Partida criada com sucesso`);
    });
    


}