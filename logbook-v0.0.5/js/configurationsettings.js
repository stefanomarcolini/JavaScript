'use strict';
/* JAVASCRIPT - CONFIGURATION - SETTINGS */

/**
 * this class provides configuration settings
 * for the connection manager object
 */
class ConfigurationSettings {
    constructor(){
        const privateConfiguration = {
            apiKey: "********",
            authDomain: "********",
            databaseURL: "********",
            projectId: "********",
            storageBucket: "********",
            messagingSenderId: "********"
        };

        return {
            configuration: privateConfiguration
        };
    };
};
