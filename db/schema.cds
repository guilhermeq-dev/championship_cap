namespace cap.championship;

using { cuid } from '@sap/cds/common';

entity Championships : cuid {
    name            : String;
    descr           : String;
    teams           : Association to many Teams on teams.championship = $self;
    matches         : Composition of many Matches on matches.championship = $self;
}

entity Teams : cuid {
    team_name           : String;
    championship        : Association to Championships;
    matches_as_team1    : Composition of many Matches on matches_as_team1.team_1 = $self;
    matches_as_team2    : Composition of many Matches on matches_as_team2.team_2 = $self;
}

entity Matches : cuid {
    team_1          : Association to Teams;
    team_2          : Association to Teams;
    date            : Timestamp;
    stadium         : Association to Stadiums;
    championship    : Association to Championships;
}

entity Stadiums : cuid {
    stadium_name    : String;
    matches         : Composition of many Matches on matches.stadium = $self;
}