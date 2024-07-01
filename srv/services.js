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
            return req.error(400, "Data e hora da partida inválida.")
        };

        const existingMatch = await SELECT.one().from(dbe.Matches).where({ date, stadium });

        if(existingMatch) {
            return req.error(400, 'Já existe uma partida agendada para este horário nesse estádio.');
        };

        console.log(`Partida entre ${team1.team_name} e ${team2.team_name} no estádio ${stadium} está valida.`);

        return req.data;
    });

    srv.on('CREATE', 'Matches', async (req, next) => {
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
    
    srv.before('CREATE', 'Championships', async (req) => {
        const { name , descr } = req.data;

        const existsChampionship = await SELECT.one().from(dbe.Championships).where({ name });

        if(existsChampionship) {
            return req.error(400, `Torneio ${name} já foi criado.`);
        }

        return console.log('Campeonato disponível para criação.');
        
    });

    srv.on('CREATE', 'Championships', async (req) => {
        const { ID, name, descr } = req.data;

        await INSERT({
            ID: ID,
            name: name,
            descr: descr
        }).into(dbe.Championships);

        const championship = await SELECT.one().from(dbe.Championships).where({ ID: ID });

        console.log(championship)

        return championship
    });

    srv.after('CREATE', 'Championships', async (req) => {
        return console.log('Campeonato criado com sucesso.')
    });

    srv.before('CREATE', 'Teams', async (req) => {
        const { ID, team_name, championship_ID } = req.data;

        const existsTeam = await SELECT.one().from(dbe.Teams).where({ team_name });

        if(existsTeam) {
            return req.error(400, "Time já cadastrado.")
        }

        return console.log(`O time ${team_name} está pronto para ser inserido no campeonato.`)

    });

    srv.on('CREATE', 'Teams', async (req) => {
        const { ID, team_name, championship_ID } = req.data;

        await INSERT({
            ID: ID,
            team_name: team_name,
            championship_ID: championship_ID
        }).into(dbe.Teams);

        const team = await SELECT.one().from(dbe.Teams).where({ ID: ID });
        
        console.log(team);

        return team;

    });

    srv.after('CREATE', 'Teams', async (req) => {
        return console.log('Time inserido no campeonato com sucesso.')
    });

    srv.on('getMatches', async (req) => {
        const selectMatches = new Promise((resolve) =>{
                resolve(SELECT.from(dbe.Matches));
           });
        
        const selectTeams = new Promise((resolve) => {
                resolve(SELECT.from(dbe.Teams));
            });

        const selectStadiums = new Promise((resolve) => {
                resolve(SELECT.from(dbe.Stadiums));
            });
        
        const results = Promise.all([selectMatches, selectTeams, selectStadiums]).then(([ matches, teams, stadiums ]) => {
            const settings = matches.map((match) => {
                return {...match, 
                    team_1: teams.find((team) => match.team_1_ID === team.ID).team_name, 
                    team_2: teams.find((team) => match.team_2_ID === team.ID).team_name, 
                    stadium: stadiums.find((stadium) => match.stadium_ID === stadium.ID).stadium_name
                }
            });

            return settings;
        });
    
        return results;
    });
}