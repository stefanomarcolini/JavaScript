'use strict';
/* JAVASCRIPT - MAIN */

//========================================================================//
//========================================================================//
//                                                                        //
//  CONNECTION SET-UP                                                     //
//                                                                        //
//========================================================================//
//========================================================================//

// config.connection;
const config = {
    apiKey: "***",
    authDomain: "***",
    databaseURL: "***",
    projectId: "***",
    storageBucket: "***",
    messagingSenderId: "***"
};

//  initialize firebase
firebase.initializeApp(config);

//  db controller
const db = firebase.firestore();

//  db settings
var settings = { /* your settings... */ timestampsInSnapshots: true };
db.settings(settings);

//  collection reference
const records = db.collection("records");

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

 // create
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

//  id
var f00_id = "";

//  view
var f00_view = "";

//  outputs
var t0_response = "";

//========================================================================//
//========================================================================//
//                                                                        //
//  CRUD OPERATIONS                                                       //
//                                                                        //
//========================================================================//
//========================================================================//

class CrudOperations {

    // constructor() {
    // };

    static message(id, HTMLinputRef, msg = "", last4chars = true) {
        var s = "";
        s = id;
        if (last4chars) {
            s = "***" + s.slice(-4, s.length);
        }
        HTMLinputRef.innerText = `Document ${msg} with ID: ${s}`;
    };

    static batcher(id){

            //  get a new write batch
            var batch = db.batch();

            //  calculate total flight time
            var tot_time = CrudOperations.calculateFlightTime(`${f5_depart_time.value}`,`${f7_arrival_time.value}`);
            tot_time = tot_time !== undefined ? tot_time : `${f9_total_flight_time.value}`;
            
            //  create document object
            const obj = {

                "f00_marca":              `${f0_marca.value}`,
                "f01_invoice":            `${f1_invoice.value}`,
                "f02_date":               `${f2_date.value}`,
                "f03_name":               `${f3_name.value}`,
                "f04_departure":          `${f4_departure.value}`,
                "f05_depart_time":        `${f5_depart_time.value}`,
                "f06_arrival":            `${f6_arrival.value}`,
                "f07_arrival_time":       `${f7_arrival_time.value}`,
                "f08_landings":           `${f8_landings.value}`,
                "f09_total_flight_time":  tot_time,
                "f10_custom":             `${f10_custom.value}`
            
            };
    
            //  set values in batch
            var docRef = db.collection("records").doc(id);
            batch.set(docRef, obj, { merge: true });
    
            //  commit batch
            batch.commit().then(() => {
                console.log("Document successfully written!");
            }).catch((err) => {
                console.log(`Error writing document: ${err}`);
            });
            
    };
    
    static calculateFlightTime(depTime, arrTime){

        if (depTime !== "" && depTime !== null && depTime !== undefined &&
            arrTime !== "" && arrTime !== null && arrTime !== undefined){
            depTime = depTime.split(/:/g);
            arrTime = arrTime.split(/:/g);

            var ha = parseInt(arrTime[0]);
            var hd = parseInt(depTime[0]);
            var ma = parseInt(arrTime[1]);
            var md = parseInt(depTime[1]);

            var h = ha - hd;
            var m = 60 - md + ma;
            var tmp = m > 60 ? m - 60 : m;

            h = h == 0 ? h : m > 60 ? h + 1 : h - 1;
            m = tmp;

            h = h < 10 ? `0${h}` : `${h}`;
            m = m < 10 ? `0${m}` : `${m}`;

            return `${h}:${m}`;
        }
        return undefined;
    };

    //=================//
    //  CREATE RECORD  //
    //=================//

    create() {


        records.add({
        }).then((doc) => {

            const id = `${doc.id}`;
            CrudOperations.batcher(id);
            CrudOperations.message(doc.id, t0_response, "created", false);
        
        }).catch((err) => {
            t0_response.innerText = `Error saving document: ${err}`;
        });

    };

    //==============//
    //  READ RECORD //
    //==============//

    read() {
        
        var id = f00_id.value;
        records.doc(id).get().then((doc) => {
            if (!doc.exists){
                throw "Document not found!";
            }
            var record = Object.values(doc.data());
            var s = undefined;
            s = "" + record;
            s = s.replace(/,/g, "\n");
            console.log(s);
            f00_view.innerText = s;
            CrudOperations.message(id, t0_response, "read");
            console.log(`${doc.data()}`);
        }).catch((err) => {
            console.error(`Error while reading: ${err}`);
        });

    };

    //================//
    //  UPDATE RECORD //
    //================//

    update(){

        var id = f00_id.value;
        var docByID = records.doc(id);

        return db.runTransaction(function(transaction) {

            return transaction.get(docByID).then(function(refDoc) {

                if (!refDoc.exists){
                    throw "Document does not exist!"
                }

                var record = Object.values(refDoc.data());
                var s = "" + record;
                s = s.replace(/,/g, "\n");

                var str = s.split(/\n/g);
                
                //  cached values from firestore
                var v0  = str[0],
                    v1  = str[1],
                    v2  = str[2],
                    v3  = str[3],
                    v4  = str[4],
                    v5  = str[5],
                    v6  = str[6],
                    v7  = str[7],
                    v8  = str[8],
                    v9  = str[9],
                    v10 = str[10];

                //  get values from fields
                v0  =  f0_marca.value !== "" && f0_marca.value !== null ? f0_marca.value : v0;
                v1  = f1_invoice.value !== "" && f1_invoice.value !== null ? f1_invoice.value : v1;
                v2  = f2_date.value !== "" && f2_date.value !== null ? f2_date.value : v2;
                v3  = f3_name.value !== "" && f3_name.value !== null ? f3_name.value : v3;
                v4  = f4_departure.value !== "" && f4_departure.value !== null ? f4_departure.value : v4;
                v5  = f5_depart_time.value !== "" && f5_depart_time.value !== null ? f5_depart_time.value : v5;
                v6  = f6_arrival.value !== "" && f6_arrival.value !== null ? f6_arrival.value : v6;
                v7  = f7_arrival_time.value !== "" && f7_arrival_time.value !== null ? f7_arrival_time.value : v7;
                v8  = f8_landings.value !== "" && f8_landings.value !== null ? f8_landings.value : v8;
                {
                    //  calculate total flight time
                    var tot_time = CrudOperations.calculateFlightTime(`${v5}`,`${v7}`);
                    tot_time = tot_time !== undefined ? tot_time : `${f9_total_flight_time.value}`;
                    v9  = tot_time !== "" && tot_time !== null ? tot_time : v9;
                    // v9  = f9_total_flight_time.value !== "" && f9_total_flight_time.value !== null ? f9_total_flight_time.value : v9;
                }
                v10 = f10_custom.value !== "" && f10_custom.value !== null ? f10_custom.value : v10;

                transaction.update(docByID, {

                    f00_marca: v0,
                    // f01_invoice: v1,
                    // f02_date: v2,
                    f03_name: v3,
                    f04_departure: v4,
                    f05_depart_time: v5,
                    f06_arrival: v6,
                    f07_arrival_time: v7,
                    f08_landings: v8,
                    f09_total_flight_time: v9,
                    f10_custom: v10

                });
                return transaction;
            });

        }).then(() => {
            CrudOperations.message(id, t0_response, "updated");
        }).catch((error) => {
            console.log(`Error updating document: ${error}`);
        });
       
    };

    //================//
    //  DELETE RECORD //
    //================//

    deleteRecord() {

        var id = f00_id.value;

        records.doc(id).delete().then(() => {
            CrudOperations.message(id, t0_response, "deleted");
            console.log("Document successfully deleted!");
        }).catch((err) => {
            console.error(`Error deleting document: ${err}`);
        });

    };
};

//========================================================================//
//========================================================================//
//                                                                        //
//  RUN PROGRAM                                                           //
//                                                                        //
//========================================================================//
//========================================================================//

//  crud operations
var crudHandler = new CrudOperations();

//  load HTML before initialization.
window.onload = function() {
    
    //  create input text
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

    //  adding listners
    b0_create.addEventListener("click", crudHandler.create);
    b1_read.addEventListener("click", crudHandler.read);
    b2_update.addEventListener("click", crudHandler.update);
    b3_delete.addEventListener("click", crudHandler.deleteRecord);
};
