using { cap.championship as my } from '../db/schema';

service MainService {

    entity Championships as projection on my.Championships;
    entity Teams as projection on my.Teams;
    entity Matches as projection on my.Matches;
    entity Stadiums as projection on my.Stadiums;

    function getMatches() returns array of {
        team_1      : String;
        team_2      : String;
        date        : Timestamp;
        stadium     : String;
    };

    action UpdateMatch(
        ID                 : String,
        team_1_ID          : String,
        team_2_ID          : String,
        date               : String,
        stadium_ID         : String,
        championship_ID    : String
    ) returns String;
}

// Utilizar no package.json
// "cds": {
//     "requires": {
//       "db": "sqlite",
//       "auth": {
//         "kind": "mocked"
//       }
//     }
//   }