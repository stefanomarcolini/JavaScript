'use strict';
/* JAVASCRIPT - CRUD DES_PATT_IMPLEM */

//========================================================================//
//========================================================================//
//                                                                        //
//  CRUD OPERATIONS                                                       //
//                                                                        //
//========================================================================//
//========================================================================//

//  MODULE PATTERN IMPLEMENTATION:
/**
 * Revealing Module pattern implementation
 * for crud operations. Only a few fields and functions are
 * revealed (return) to public context, the rest remains
 * private (scoped within the class).
 */
class Crud {

    constructor() {
        //  private: declare fields & methods
        var privateDb,
            privateCollectionRef,
            privateCollectionName,
            privateObj,
            defineProp,
            privateMessage,
            privateErrorMessage,
            privateBatch,
            privateErrRecordDelete,
            privateCalculateFlightTime,
            privateTotalFlightTime,
            privateObjVal2StrArr,
            privateCheckTimeVal,
            privateObjHasValue,
            privateObjValArrUpdate,
            privateDocViewFormat;
        
        
        //  private: initialize fields & methods
        privateDb = undefined;
        privateCollectionRef = undefined;
        privateCollectionName = "";
        privateObj = {};

        /**
         * private: adds a property to the private object
         * of Crud class
         */
        defineProp = function(key, value) {
            var config = {
                value: value,
                writable: true,
                enumerable: true,
                configurable: true
            };
            Object.defineProperty(privateObj, key, config);
        };
        /**
         * private: takes an object and returns a string array
         * of all its values
         */
        privateObjVal2StrArr = function(objct) {
            var s = `${Object.values(objct)}`;
            s = s.replace(/,/g, "\n");
            s = s.split(/\n/g);
            return s;
        };
        /**
         * private: check time values
         */
        privateCheckTimeVal = function(v) {
            var s = `${v}`;
            if (s.includes("-")) {
                return false;
            }
            s = s.replace(/:/g, "\n");
            s = s.split(/\n/g);
            s = s[0] < 0 || s[0] > 23 || s[1] < 0 || s[2] > 59 || isNaN(s[0])|| isNaN(s[1]) ? false : true;
            return s;
        }
        /**
         * private: checks if a value is associated to an object property
         */
        privateObjHasValue = function(objct, idx) {
            return Object.values(objct)[idx] !== "" && Object.values(objct)[idx] !== null && Object.values(objct)[idx] !== undefined ? true : false;
        };
        /**
         * private: updates the whole array of object values
         * given depart, arrival and total time
         * indexes (project specific)
         */
        privateObjValArrUpdate = function(v, objct, idep, iarr, itot) {
            //  cache v[idep] & v[iarr] values
            const tmpDep = v[idep];
            const tmpArr = v[iarr];

            for (var i = 0; i < v.length; i++) {
                if (i !== itot) {
                    v[i]  =  privateObjHasValue(objct, i) ? Object.values(objct)[i] : v[i];
                } else {
                    //  calculate total flight time
                    var tot_time = privateCalculateFlightTime(v[idep], v[iarr]);
                    tot_time = tot_time !== undefined ? tot_time : `${Object.values(objct)[i]}`;
                    
                    //  set value from valid field's value
                    v[i]  = tot_time !== false ? tot_time : v[i];
                    
                    //  reset to cached values v5 & v7 in case of tot_time === false
                    v[idep] = tot_time !== false ? v[idep] : tmpDep;
                    v[iarr] = tot_time !== false ? v[iarr] : tmpArr;
                }
            }
            return v;
        };
        /**
         * private: creates an output message
         */
        privateMessage = function(id, HTMLinputRef, msg, last4chars) {
            var s = "";
            s = id;
            if (last4chars) {
                s = "***" + s.slice(-4, s.length);
            }
            HTMLinputRef.innerText = `Document ${msg} with ID: ${s}`;
        };
        /**
         * private: creates an error message
         */
        privateErrorMessage = function(HTMLinputRef, msg){
            HTMLinputRef.innerText = msg;
        };
        /**
         * private: calculates flight time (delta t)
         * format: hh:mm
         */
        privateCalculateFlightTime = function(depTime, arrTime){

            if (depTime !== "" && depTime !== null && depTime !== undefined &&
                arrTime !== "" && arrTime !== null && arrTime !== undefined) {
                
                if (depTime.includes("-") || arrTime.includes("-")) {
                    return false;
                }

                depTime = depTime.split(/:/g);
                arrTime = arrTime.split(/:/g);
    
                const ha = parseInt(arrTime[0]);
                const hd = parseInt(depTime[0]);
                const ma = parseInt(arrTime[1]);
                const md = parseInt(depTime[1]);
    
                if (ha < hd || 
                    (hd == ha && md > ma) || 
                    (ha < 0) || (hd < 0) || (ha > 23) || (md > 23) ||
                    (ma < 0) || (md < 0) || (ma > 59) || (md > 59) ||
                    isNaN(ha) || isNaN(hd) || isNaN(ma) || isNaN(md)) {

                    return false;

                } else {

                    var m = (60 - md);
                    m += ((ha - (hd + 1)) * 60) + ma;
                    var h = parseInt(`${m / 60}`);
                    m = m % 60;

                    h = h == 0 ? "00" : h < 10 ? `0${h}` : h;
                    m = m == 0 ? "00" : m < 10 ? `0${m}` : m;
        
                    return `${h}:${m}`;
                }
            }
            return undefined;
        };
        /**
         * private: returns the total flight time
         */
        privateTotalFlightTime = function(DOM_dep_t, DOM_arr_t, DOM_tot_t){
            //  calculate total flight time
            var tot_time = privateCalculateFlightTime(`${DOM_dep_t}`,`${DOM_arr_t}`);
            
            tot_time = tot_time !== undefined ? tot_time : `${DOM_tot_t}`;
            
            return tot_time;
        };
        /**
         * private: firebase batch function, adds some
         * project specific code to update the 
         * document object
         */
        privateBatch = function(db, coll, id, objct, DOM_response) {
                    
            var batch = db.batch();
                                
            //  string array of values of referenced data
            var v = privateObjVal2StrArr(objct);
            
            //  set modified new values
            v = privateObjValArrUpdate(v, objct, 5, 7, 9);
            
            //  change referenced object values
            privateObj = {

                f00_marca: v[0],
                f01_invoice: v[1],
                f02_date: v[2],
                f03_name: v[3],
                f04_departure: v[4],
                f05_depart_time: v[5],
                f06_arrival: v[6],
                f07_arrival_time: v[7],
                f08_landings: v[8],
                f09_total_flight_time: v[9],
                f10_custom: v[10]

            };
            
            var tot_time = !privateCheckTimeVal(v[5]) || !privateCheckTimeVal(v[7]) ? false : v[9] || false;
            // tot_time = v[9] || false;

            //  set values in batch
            var docRef = coll.doc(id);
            batch.set(docRef, privateObj, { merge: true });

            //  commit batch
            batch.commit().then(function() {
                if (!tot_time) {
                    privateErrRecordDelete(coll, id, DOM_response);
                } else {
                    console.log("Document successfully written!");
                }
            }).catch((err) => {
                console.log(`Error writing document: ${err}`);
            });
            
        };

        /**
         * private: deletes a just created document in case of
         * incompatible departure and arrival time values
         */
        privateErrRecordDelete = function(coll, id, DOM_response) {

            coll.doc(id).delete().then(function() {

                privateMessage(id, DOM_response, "with wrong departure or arrival time created and deleted", false);
                
                console.log("Document successfully deleted!");

            }).catch((err) => {
                console.error(`Error deleting document: ${err}`);
            });
        };
        /**
         * private: returns a formatted string 
         * of the document object values
         */
        privateDocViewFormat = function(docObj) {
            var record = Object.values(docObj);
            var s = undefined;
            s = "" + record;
            s = s.replace(/,/g, "\n");
            return s;
        };


        //  public: define & initialize fields & methods
        return {
            db: privateDb,
            collectionRef: privateCollectionRef,
            collectionName: privateCollectionName,
            obj: privateObj,
            /**
             * public: add property to class object field
             */
            addProp: function(k, v) {
                        defineProp(k, v);
                    },
            /**
             * public: calculates flight time
             */
            calculateFlightTime: function(depTime, arrTime){
                        privateCalculateFlightTime(depTime, arrTime);
                    },
            /**
             * public: returns total flight time
             */
            totalFlightTime: function(DOM_dep_t, DOM_arr_t, DOM_tot_t){
                        privateTotalFlightTime(DOM_dep_t, DOM_arr_t, DOM_tot_t);
                    },
            /**
             * public: createa a new document into the databese
             */
            create: function(db, coll, objct, DOM_response){
                        coll.add({
                        /**
                         *  1) An empy document is always created, and its ID cached.
                         *  2) The same document is updated with a batched operation and,
                         *     if a formal error occurs, immediatedly deleted.
                         */
                        }).then(function(doc) {

                            const id = `${doc.id}`;
                            
                            privateBatch(db, coll, id, objct, DOM_response);

                            privateMessage(doc.id, DOM_response, "created", false);
                        
                        }).catch((err) => {
                            DOM_response.innerText = `Error saving document: ${err}`;
                        });
                    },
            /**
             * public: reads an existing document from database 
             */   
            read: function(coll, id, DOM_view, DOM_response){
                        if (id != "" && id != null && id != undefined) {

                            coll.doc(id).get().then(function(doc) {

                                if (!doc.exists){
                                    throw "Document not found!";
                                }

                                //  formatted string of document values
                                var s = privateDocViewFormat(doc.data());
                                DOM_view.innerText = s;

                                privateMessage(id, DOM_response, "read");

                            }).catch((err) => {
                                console.error(`Error while reading: ${err}`);
                            });
                        }
                    },
            /**
             * public: updates an existing document into the database
             */
            update: function(coll, db, id, objct, DOM_response){
                        var docByID = coll.doc(id);

                        return db.runTransaction(function(transaction) {

                            return transaction.get(docByID).then(function(refDoc) {

                                if (!refDoc.exists){
                                    throw "Document does not exist!"
                                }
                                
                                //  string array of values of referenced data
                                var v = privateObjVal2StrArr(refDoc.data());
                                
                                //  set modified new values
                                v = privateObjValArrUpdate(v, objct, 5, 7, 9);
                                
                                //  change referenced object values
                                transaction.update(docByID, {

                                    f00_marca: v[0],
                                    // f01_invoice: v[1],
                                    // f02_date: v[2],
                                    f03_name: v[3],
                                    f04_departure: v[4],
                                    f05_depart_time: v[5],
                                    f06_arrival: v[6],
                                    f07_arrival_time: v[7],
                                    f08_landings: v[8],
                                    f09_total_flight_time: v[9],
                                    f10_custom: v[10]

                                });

                                return transaction;

                            });

                        }).then(() => {
                            privateMessage(id, DOM_response, "updated");
                        }).catch((error) => {
                            console.log(`Error updating document: ${error}`);
                        });
                    },
            /**
             * public: deletes an existing document from database
             */
            delete: function(coll, id, DOM_response){
                
                        coll.doc(id).delete().then(function() {

                            privateMessage(id, DOM_response, "deleted");

                            console.log("Document successfully deleted!");

                        }).catch((err) => {
                            console.error(`Error deleting document: ${err}`);
                        });
                    }
            
        };//  end of public pointers

    };//  end of constructor()

};//  end of Crud class


//========================================================================//
//========================================================================//
//                                                                        //
//  RUN PROGRAM                                                           //
//                                                                        //
//========================================================================//
//========================================================================//

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

//  connection manager
var conn = new ConnectionManager();
conn.config = {
    apiKey: "****",
    authDomain: "****",
    databaseURL: "****",
    projectId: "****",
    storageBucket: "****",
    messagingSenderId: "****"
};
conn.init(firebase.initializeApp(conn.config));
//  db manager
const dbm = new DBManager();

//========================================================================//
//========================================================================//
//                                                                        //
//  DOM DECLARED VARIABLES                                                //
//                                                                        //
//========================================================================//
//========================================================================//

/**
 *  f* -> input fields
 *  b* -> buttons
 *  t* -> output text
 */

// input fields
var f0_marca = "";
var f1_invoice = "";
var f2_date = "";
var f3_name = "";
var f4_departure = "";
var f5_depart_time = "";
var f6_arrival = "";
var f7_arrival_time = "";
var f8_landings = "";
var f9_total_flight_time = "";
var f10_custom = "";
//  buttons
var b0_create;
var b1_read;
var b2_update;
var b3_delete;
//  id filed
var f00_id = "";
//  view ref
var f00_view = "";
//  output ref
var t0_response = "";
// crud function handlers
var c,r,u,d;
//  object document
var getObjVal;




//  Crud operations handler
var crud = new Crud();
//  db controller
crud.db = dbm.db(firebase.firestore());
//  db settings
dbm.settings = { /* your settings... */ timestampsInSnapshots: true };
crud.db.settings(dbm.settings);
//  collection
crud.collectionName = "records";
crud.collectionRef = dbm.coll(crud.db.collection(crud.collectionName));

//  initialize DOM elements handlers
 var initializeVariables = function() {

    //  input text
    f0_marca               = document.getElementById("txt-marca");
    f1_invoice             = document.getElementById("txt-inv");
    f2_date                = document.getElementById("txt-date");
    f3_name                = document.getElementById("txt-name");
    f4_departure           = document.getElementById("txt-dep");
    f5_depart_time         = document.getElementById("txt-dep-h");
    f6_arrival             = document.getElementById("txt-arr");
    f7_arrival_time        = document.getElementById("txt-arr-h");
    f8_landings            = document.getElementById("txt-lnd");
    f9_total_flight_time   = document.getElementById("txt-tot");
    f10_custom             = document.getElementById("txt-custom");

    //  buttons
    b0_create              = document.getElementById("btn-save");
    b1_read                = document.getElementById("btn-read");
    b2_update              = document.getElementById("btn-update");
    b3_delete              = document.getElementById("btn-delete");
    
    //  id
    f00_id                 = document.getElementById("txt-id");
    
    //  view
    f00_view               = document.getElementById("txt-view");

    //  output text
    t0_response            = document.getElementById("txt-response");

    //  adding listners to buttons passing callback functions
    b0_create.addEventListener("click", c);
    b1_read.addEventListener("click", r);
    b2_update.addEventListener("click", u);
    b3_delete.addEventListener("click", d);

};
 

//  Initialize DOM elements handlers
window.onload = function() {
    initializeVariables();
};

/**
 * resets and returns object document values
 */
var getObj = function() {

    return crud.obj = {

        "f00_marca":              `${f0_marca.value}`,
        "f01_invoice":            `${f1_invoice.value}`,
        "f02_date":               `${f2_date.value}`,
        "f03_name":               `${f3_name.value}`,
        "f04_departure":          `${f4_departure.value}`,
        "f05_depart_time":        `${f5_depart_time.value}`,
        "f06_arrival":            `${f6_arrival.value}`,
        "f07_arrival_time":       `${f7_arrival_time.value}`,
        "f08_landings":           `${f8_landings.value}`,
        "f09_total_flight_time":  "",
        "f10_custom":             `${f10_custom.value}`

    };
};

/**
 * calls create function
 */
c = function() {

    var obj = getObj();
    crud.create(crud.db, crud.collectionRef, obj, t0_response);
};
/**
 * calls read function
 */
r = function() {
    crud.read(crud.collectionRef, f00_id.value, f00_view, t0_response);
};
/**
 * calls update function
 */
u = function() {
    var obj = getObj();
    crud.update(crud.collectionRef, crud.db, f00_id.value, obj, f00_view);
};
/**
 * calls delete function
 */
d = function() {
    crud.delete(crud.collectionRef, f00_id.value, f00_view);
};