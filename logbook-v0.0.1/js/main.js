/* JAVASCRIPT - MAIN */

// logbook v0.0.1

//========================================================================//
//========================================================================//
//                                                                        //
//  CONNECTION SET-UP                                                     //
//                                                                        //
//========================================================================//
//========================================================================//

//  db controller
const db = firebase.firestore();

//  required settings
var settings = { /* your settings... */ timestampsInSnapshots: true };
db.settings(settings);

const records = db.collection("record");     //  collection -> record

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

//  read
var f00_r_view = "";
var f00_r_id = "";


//  update
var f0_u_marca = "";
// var f1_u_invoice = "";
// var f2_u_date = "";
var f3_u_name = "";
var f4_u_departure = "";
var f5_u_depart_time = "";
var f6_u_arrival = "";
var f7_u_arrival_time = "";
var f8_u_landings = "";
var f9_u_total_flight_time = "";
var f10_u_custom = "";
var f00_u_id = "";

//  delete
var f00_d_id = "";

//  buttons
var b0_create;
var b1_read;
var b2_update;
var b3_delete;

//  outputs
var t0_c_response = "";
var t0_r_response = "";
var t0_u_response = "";
var t0_d_response = "";

//  load HTML before initialization.
window.onload = function() {
    
    //  create input text
    f0_marca             = document.getElementById("txt-marca");
    f1_invoice           = document.getElementById("txt-inv");
    f2_date              = document.getElementById("txt-date");
    f3_name              = document.getElementById("txt-name");
    f4_departure         = document.getElementById("txt-dep");
    f5_depart_time       = document.getElementById("txt-dep-h");
    f6_arrival           = document.getElementById("txt-arr");
    f7_arrival_time      = document.getElementById("txt-arr-h");
    f8_landings          = document.getElementById("txt-lnd");
    f9_total_flight_time = document.getElementById("txt-tot");
    f10_custom           = document.getElementById("txt-custom");

    //  Read
    f00_r_view                = document.getElementById("txt-r-view");
    f00_r_id               = document.getElementById("txt-r-id");

    //  update input text
    f0_u_marca             = document.getElementById("txt-u-marca");
    // f1_u_invoice           = document.getElementById("txt-u-inv");
    // f2_u_date              = document.getElementById("txt-u-date");
    f3_u_name              = document.getElementById("txt-u-name");
    f4_u_departure         = document.getElementById("txt-u-dep");
    f5_u_depart_time       = document.getElementById("txt-u-dep-h");
    f6_u_arrival           = document.getElementById("txt-u-arr");
    f7_u_arrival_time      = document.getElementById("txt-u-arr-h");
    f8_u_landings          = document.getElementById("txt-u-lnd");
    f9_u_total_flight_time = document.getElementById("txt-u-tot");
    f10_u_custom           = document.getElementById("txt-u-custom");
    f00_u_id               = document.getElementById("txt-u-id");

    //  delete input text
    f00_d_id               = document.getElementById("txt-d-id");

    //  buttons
    b0_create              = document.getElementById("btn-save");
    b1_read                = document.getElementById("btn-read");
    b2_update              = document.getElementById("btn-update");
    b3_delete              = document.getElementById("btn-delete");

    //  output text
    t0_c_response            = document.getElementById("txt-response");
    t0_r_response          = document.getElementById("txt-r-response");
    t0_u_response          = document.getElementById("txt-u-response");
    t0_d_response          = document.getElementById("txt-d-response");

    //  adding listners
    b0_create.addEventListener("click", create);
    b1_read.addEventListener("click", read);
    b2_update.addEventListener("click", update);
    b3_delete.addEventListener("click", deleteRecord);
};

//========================================================================//
//========================================================================//
//                                                                        //
//  CRUD OPERATIONS                                                       //
//                                                                        //
//========================================================================//
//========================================================================//

//=================//
//  CREATE RECORD  //
//=================//

function create () {

    records.add({
        f00_marca:              `${f0_marca.value}`,
        f01_invoice:            `${f1_invoice.value}`,
        f02_date:               `${f2_date.value}`,
        f03_name:               `${f3_name.value}`,
        f04_departure:          `${f4_departure.value}`,
        f05_depart_time:        `${f5_depart_time.value}`,
        f06_arrival:            `${f6_arrival.value}`,
        f07_arrival_time:       `${f7_arrival_time.value}`,
        f08_landings:           `${f8_landings.value}`,
        f09_total_flight_time:  `${f9_total_flight_time.value}`,
        f10_custom:             `${f10_custom.value}`
    }).then((doc) => {
        message(doc.id, t0_c_response, "created", false);
    }). catch((err) => {
        t0_c_response.innerText = `Error saving document: ${err}`;
    });
};

//==============//
//  READ RECORD //
//==============//

function read() {

    var id = f00_r_id.value;
    records.doc(id).get().then((doc) => {
        var record = Object.values(doc.data());
            var s = "" + record;
            s = s.replace(/,/g, "\n");
            f00_r_view.innerText = s;
            message(id, t0_r_response, "read");
            console.log(`${record}`);
    }).catch((err) => {
        console.error(`Error while reading: ${err}`);
    });

};

// function read1() {

//     records.get().then(resultSet => {
//         var s = "";
//         var item = undefined;
//         resultSet.forEach(doc => {
//             item = Object.values(doc.data());       //  item = <Value>
//             // item = Object.entries(doc.data());   //  item = <Key, Value>
//         });
//         item.forEach(prop => {
//             s += prop + "\n";
//             s = s.replace(",", ": ");
//         });
//         f00_r_view.innerText = s;
//     }).catch(error => {
//         console.error(`Error while reading: ${error}`);
//     });

// };

//================//
//  UPDATE RECORD //
//================//

function message(id, HTMLinputRef, msg = "", last4chars = true) {
    var s = "";
    s = id;
    if (last4chars) {
        s = "***" + s.slice(-4, s.length);
    }
    HTMLinputRef.innerText = `Document ${msg} with ID: ${s}`;
};

function update() {

    var id = f00_u_id.value;

    if(`${f0_u_marca.value}` !== "" && `${f0_u_marca.value}` !== null){
        records.doc(id).update({
            f00_marca: f0_u_marca.value
        }).then(() => {
            message(id, t0_u_response, "updated");
            console.log(`Document successfully updated!`);
        }).catch((err) => {
            console.log(`Error updating document: ${err}`);
        });
    }
    if(`${f3_u_name.value}` !== "" && `${f3_u_name.value}` !== null){
        records.doc(id).update({
            f03_name: f3_u_name.value
        }).then(() => {
            message(id, t0_u_response, "updated");
            console.log(`Document successfully updated!`);
        }).catch((err) => {
            console.log(`Error updating document: ${err}`);
        });
    }
    if(`${f4_u_departure.value}` !== "" && `${f4_u_departure.value}` !== null){
        records.doc(id).update({
            f04_departure: f4_u_departure.value
        }).then(() => {
            message(id, t0_u_response, "updated");
            console.log(`Document successfully updated!`);
        }).catch((err) => {
            console.log(`Error updating document: ${err}`);
        });
    }
    if(`${f5_u_depart_time.value}` !== "" && `${f5_u_depart_time.value}` !== null){
        records.doc(id).update({
            f05_depart_time: f5_u_depart_time.value
        }).then(() => {
            message(id, t0_u_response, "updated");
            console.log(`Document successfully updated!`);
        }).catch((err) => {
            console.log(`Error updating document: ${err}`);
        });
    }
    if(`${f6_u_arrival.value}` !== "" && `${f6_u_arrival.value}` !== null){
        records.doc(id).update({
            f06_arrival: f6_u_arrival.value
        }).then(() => {
            message(id, t0_u_response, "updated");
            console.log(`Document successfully updated!`);
        }).catch((err) => {
            console.log(`Error updating document: ${err}`);
        });
    }
    if(`${f7_u_arrival_time.value}` !== "" && `${f7_u_arrival_time.value}` !== null){
        records.doc(id).update({
            f07_arrival_time: f7_u_arrival_time.value
        }).then(() => {
            message(id, t0_u_response, "updated");
            console.log(`Document successfully updated!`);
        }).catch((err) => {
            console.log(`Error updating document: ${err}`);
        });
    }
    if(`${f8_u_landings.value}` !== "" && `${f8_u_landings.value}` !== null){
        records.doc(id).update({
            f08_landings: f8_u_landings.value
        }).then(() => {
            message(id, t0_u_response, "updated");
            console.log(`Document successfully updated!`);
        }).catch((err) => {
            console.log(`Error updating document: ${err}`);
        });
    }
    if(`${f9_u_total_flight_time.value}` !== "" && `${f9_u_total_flight_time.value}` !== null){
        records.doc(id).update({
            f09_total_flight_time: f9_u_total_flight_time.value
        }).then(() => {
            message(id, t0_u_response, "updated");
            console.log(`Document successfully updated!`);
        }).catch((err) => {
            console.log(`Error updating document: ${err}`);
        });
    }
    if(`${f10_u_custom.value}` !== "" && `${f10_u_custom.value}` !== null){
        records.doc(id).update({
            f10_custom: f10_u_custom.value
        }).then(() => {
            message(id, t0_u_response, "updated");
            console.log(`Document successfully updated!`);
        }).catch((err) => {
            console.log(`Error updating document: ${err}`);
        });
    }

};

//================//
//  DELETE RECORD //
//================//

function deleteRecord() {

    var id = f00_d_id.value;

    records.doc(id).delete().then(() => {
        message(id, t0_d_response, "deleted");
        console.log("Document successfully deleted!");
    }).catch((err) => {
        console.error(`Error deleting document: ${err}`);
    });

};

//========================================================================//
//========================================================================//
//                                                                        //
//  RUN OTHER PROGRAM FUNCTIONALITES                                      //
//                                                                        //
//========================================================================//
//========================================================================//

//  TODO...

