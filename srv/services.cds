using { cap.championship as my } from '../db/schema';

service MainService {

    entity Championships as projection on my.Championships;
    entity Teams as projection on my.Teams;
    entity Matches as projection on my.Matches;

    function getMatches() returns array of {
        team_1      : String;
        team_2      : String;
        date        : Timestamp;
        stadium     : String;
    }
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