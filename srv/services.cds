using { cap.championship as my } from '../db/schema';

service MainService {

    entity Championships as projection on my.Championships;
    entity Teams as projection on my.Teams;
    entity Matches as projection on my.Matches;
};