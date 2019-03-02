'use strict';
/* JAVASCRIPT - CONNECTION MANAGER */

/**
 * A wrapper class to connect to firebase
 * 
 * provides: 
 *      - configurations
 *      - initialization()
 */
class ConnectionManager {
    constructor() {
        // config.connection;
        this.config = undefined;
        //  initialize App
        this.init = async function(init) {
            await init;
        };
    };
};