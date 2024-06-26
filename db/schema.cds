namespace cap.championship;

using { cuid } from '@sap/cds/common';

entity Championships : cuid {
    name        : String;
    descr       : String;
    teams       : Composition of many Teams on teams.championship = $self;
    matches     : Composition of many Matches on matches.championship = $self;
}

entity Teams : cuid {
    team_name       : String;
    championship    : Association to Championships;
}

entity Matches : cuid {
    team_1          : Association to Teams;
    team_2          : Association to Teams;
    date            : Date;
    stadium         : String;
    scoreboard      : String default '0-0';
    championship    : Association to Championships;
}