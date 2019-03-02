/* JAVASCRIPT */
'use strict';

/**
 * This class is ment to manage Time
 * it contains the following functions:
 * 
 *  -   parseTime(strTime: string);
 *  -   time(hour:any, min:any, sec:any, millisec:any);
 *  -   millisec2time(millisec:any);
 *  -   time2min(strTime:string);
 *  -   time2sec(strTime:string);
 *  -   time2millisec(strTime:string);
 *  -   subtractTime(strTime1:string, strTime2:string);
 */
class TimeManager {

    /**
     * REQUIRES: string
     * 
     * MODIFIES: nothing
     * 
     * EFFECT: a time object with the following properties: hours, minutes, seconds, milliseconds
     * @param {string} strTime 
     */
    parseTime(strTime) {
        var n = 0;
        for (var i = 0; i < strTime.length; i++) {
            n = strTime[i] === ":" ? ++n : n;
        }
    
        for (var i = 0; i < 3 - n; i++) {
            strTime += ":";
        }
    
        var timeArr = strTime.split(':');
    
        var h = timeArr[0];
        var m = timeArr[1];
        var s = timeArr[2];
        var ms = timeArr[3];
    
        timeArr[0] = isNaN(h) || Number.parseInt(h) < 0 || Number.parseInt(h) > 23 ? "Error: invalid value" : h === "" ? 0 : Number.parseInt(h);
        timeArr[1] = isNaN(m) || Number.parseInt(m) < 0 || Number.parseInt(m) > 59 ? "Error: invalid value" : m === "" ? 0 : Number.parseInt(m);
        timeArr[2] = isNaN(s) || Number.parseInt(s) < 0 || Number.parseInt(s) > 59 ? "Error: invalid value" : s === "" ? 0 : Number.parseInt(s);
        timeArr[3] = isNaN(ms) || Number.parseInt(ms) < 0 || Number.parseInt(ms) > 999 ? "Error: invalid value" : ms === "" ? 0 : Number.parseInt(ms);
    
        return {
            hours: timeArr[0],
            minutes: timeArr[1],
            seconds: timeArr[2],
            millisec: timeArr[3]
        };
    }   //  parseTime(strTime)


    /**
     * REQUIRES: 0 to 4 values that can represent time values
     * 
     * MODIFIES: nothing
     * 
     * EFFECT: a time object with the following parameters: hours, minutes, seconds, milliseconds, time
     * @param {{string, number}} hour 
     * @param {{string, number}} min 
     * @param {{string, number}} sec 
     * @param {{string, number}} millisec 
     */
    time(hour = 0, min = 0, sec = 0, millisec = 0) {

        var h = isNaN(hour) || Number.parseInt(hour) < 0 || Number.parseInt(hour) > 23 ? "Error: invalid value" : hour === "" ? 0 : Number.parseInt(hour);
        var m = isNaN(min) || Number.parseInt(min) < 0 || Number.parseInt(min) > 59 ? "Error: invalid value" : min === "" ? 0 : Number.parseInt(min);
        var s = isNaN(sec) || Number.parseInt(sec) < 0 || Number.parseInt(sec) > 59 ? "Error: invalid value" : sec === "" ? 0 : Number.parseInt(sec);
        var ms = isNaN(millisec) || Number.parseInt(millisec) < 0 || Number.parseInt(millisec) > 999 ? "Error: invalid value" : millisec === "" ? 0 : Number.parseInt(millisec);
    
        var t = `${h}:${m}:${s}:${ms}`;
        return {
            hours: h,
            minutes: m,
            seconds: s,
            millisec: ms,
            time: t
        };
    }   //  time(hour, min, sec, millisec)


    /**
     * REQUIRES: a number or a string that represents time expressed in milliseconds
     * 
     * MODIFIES: nothing
     * 
     * EFFECT: a time object with the following parameters: hours, minutes, seconds, milliseconds, time
     * @param {{string, number}} millisec 
     */
    millisec2time(millisec) {
        millisec = millisec === "" ? 0 : Number.parseInt(millisec);
        if (isNaN(millisec)) {
            return "Error: invalid value";
        }

        var h = Math.floor(millisec/3600000);
        var m = Math.floor(millisec/60000) - h*60;
        var s = Math.floor(millisec/1000) - h*3600 - m*60;
        var ms = millisec - h*3600000 - m*60000 - s*1000;
        return this.time(h, m, s, ms);
    }   //  millsec2time


    /**
     * REQUIRES: a formatted string representing a time value (hh:mm:ss:mls)
     * 
     * MODIFIES: nothing
     *
     * EFFECT: returns the time value expressed in minutes
     * @param {string} strTime
     */
    time2min(strTime) {
        var t = this.parseTime(strTime);
        return (t.minutes + t.hours*60);
    }   //  time2min(strTime)


    /**
     * REQUIRES: a formatted string representing a time value (hh:mm:ss:mls)
     * 
     * MODIFIES: nothing
     *
     * EFFECT: returns the time value expressed in seconds
     * @param {string} strTime
     */
    time2sec(strTime) {
        var t = this.parseTime(strTime);
        return (t.seconds + t.minutes*60 + t.hours*3600);
    }   //  time2sec(strTime)


    /**
     * REQUIRES: a formatted string representing a time value (hh:mm:ss:mls)
     * 
     * MODIFIES: nothing
     *
     * EFFECT: returns the time value expressed in milliseconds
     * @param {string} strTime 
     */
    time2millisec(strTime) {
        var t = this.parseTime(strTime);
        return (t.millisec + t.seconds*1000 + t.minutes*60000 + t.hours*3600000);
    }   //  time2millisec(strTime)


    /**
     * REQUIRES: two formatted strings representing time values (hh:mm:ss:mls)
     * 
     * MODIFIES: nothing
     * 
     * EFFECT: returns the difference of the two time values in milliseconds
     * @param {string} t1 
     * @param {string} t2 
     */
    subtractTime(strTime1, strTime2) {
        var timeArr1 = this.time2millisec(strTime1);
        var timeArr2 = this.time2millisec(strTime2);
        return timeArr1 - timeArr2;
    }
}

//  EXAMPLES:

var t = new TimeManager();

console.log(t.parseTime("13:55:34:144"));
console.log(t.time(8,55,34,144).time);
console.log(t.millisec2time("3661111"));
console.log(t.time2min("13:55:34:144"));
console.log(t.time2sec("13:55:34:144"));
console.log(t.time2millisec("1:1:1:111"));
console.log(t.subtractTime("1:1:1:111", "1:1:0:101"));