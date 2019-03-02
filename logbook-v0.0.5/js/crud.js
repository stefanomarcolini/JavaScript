'use strict';
/* JAVASCRIPT - CRUD */

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
        };

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

                const tm = new TimeManager();
                var depMls = tm.time2millisec(depTime);
                var arrMls = tm.time2millisec(arrTime);

                var depT = tm.millisec2time(depMls).time;
                var arrT = tm.millisec2time(arrMls).time;

                var subMls = tm.subtractTime(arrT, depT);

                var h = tm.millisec2time(subMls).hours;
                var m = tm.millisec2time(subMls).minutes;

                h = h == 0 ? "00" : h < 10 ? `0${h}` : h;
                m = m == 0 ? "00" : m < 10 ? `0${m}` : m;
                
                return `${h}:${m}`;
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
                //  TODO: INVALIDATE IMMISSION IF WRONG FIELDS -> ie: return;
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
                            privateErrorMessage(DOM_response, `Error saving document: ${err}`);
                            console-error(`Error saving document: ${err}`);
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
                                privateErrorMessage(DOM_response, `Error occured reading document: ${err}`);
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
                                //  f01_invoice & f02_date should never be updated
                                //  as they point to an unique document
                                //  better to delete and create a new record
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
                            privateErrorMessage(DOM_response, `Error updating document: ${err}`);
                            console.error(`Error updating document: ${error}`);
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
                            privateErrorMessage(DOM_response, `Error deleting document: ${err}`);
                            console.error(`Error deleting document: ${err}`);
                        });
                    }
            
        };//  end of public pointers

    };//  end of constructor()

};//  end of Crud class
