'use strict';
/* JAVASCRIPT - PROGRAM */

//========================================================================//
//========================================================================//
//                                                                        //
//  CONFIGURATIONS                                                        //
//                                                                        //
//========================================================================//
//========================================================================//

//  configuration settings
const config = new ConfigurationSettings();

//  connection manager
const conn = new ConnectionManager();
conn.config = config.configuration;
conn.init(firebase.initializeApp(conn.config));

// //  login manager
// const user = new LoginManager();

//  db manager
const dbm = new DBManager();

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
var b00_signin;
var b00_logout;
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

        "f00_marca":              `${dom.f0_marca.value}`,
        "f01_invoice":            `${dom.f1_invoice.value}`,
        "f02_date":               `${dom.f2_date.value}`,
        "f03_name":               `${dom.f3_name.value}`,
        "f04_departure":          `${dom.f4_departure.value}`,
        "f05_depart_time":        `${dom.f5_depart_time.value}`,
        "f06_arrival":            `${dom.f6_arrival.value}`,
        "f07_arrival_time":       `${dom.f7_arrival_time.value}`,
        "f08_landings":           `${dom.f8_landings.value}`,
        "f09_total_flight_time":  "",//`${dom.f9_total_flight_time.value}`,
        "f10_custom":             `${dom.f10_custom.value}`

    };
};


/**
 * call create function
 */
c = function() {
    var obj = getObj();
    crud.create(crud.db, crud.collectionRef, obj, t0_response);
};

/**
 * call read function
 */
r = function() {
    crud.read(crud.collectionRef, f00_id.value, f00_view, t0_response);
};

/**
 * call update function
 */
u = function() {
    var obj = getObj();
    crud.update(crud.collectionRef, crud.db, f00_id.value, obj, f00_view);
};

/**
 * call delete function
 */
d = function() {
    crud.delete(crud.collectionRef, f00_id.value, f00_view);
};
