'use strict';
/* JAVASCRIPT - DATABASE MANAGER */

/**
 * A wrapper class to manage a firebase database
 * 
 * provides: 
 *      - controller()
 *      - settings
 *      - collection()
 */
class DBManager {
    constructor(){
        //  db controller
        this.db = function(dbService) {
            return dbService;
        };
        //  db settings
        this.settings = undefined;

        this.coll = function(coll){
            return coll;
        };
    };
};