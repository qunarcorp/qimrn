/*************************************************************************************************
 * <pre>
 * @包路径：
 *
 * @类描述:
 * @版本:       V3.0.0
 * @作者        bigwhite
 * @创建时间    2018-08-22 21:39
 *
 * @修改记录：
 -----------------------------------------------------------------------------------------------
 ----------- 时间      |   修改人    |     修改的方法       |         修改描述   ---------------
 -----------------------------------------------------------------------------------------------
 </pre>
 ************************************************************************************************/
'use strict';
import React, {Component} from 'react'
import moment from 'moment';

class DateUtil extends React.Component {

    static TimeToHours(str) {
        // moment(str).hours(moment(str).hours()+1)

        return moment(moment(str).hours(moment(str).hours() + 1).minutes(0)).format("YYYY-MM-DD HH:mm");
    }

    static TimeIncreaseHours(str) {
        // return  moment(str).hours(moment(str).hours()+1).minutes(0);

        return moment(moment(str).hours(moment(str).hours() + 1)).format("YYYY-MM-DD HH:mm");
    }

    static TimeZero(str){
        if(moment(str).minutes()>30){
         return   moment(moment(str).hours(moment(str).hours() + 1)).minutes(0).format("YYYY-MM-DD HH:mm")
        }else{
         return  moment(str).minutes(30).format("YYYY-MM-DD HH:mm")
        }
    }

    static TimeDayAdd(str, day) {
        return moment(moment(str).days(moment(str).days() + day)).format("YYYY-MM-DD HH:mm");
    }


    static mandatoryHours(str, hour) {
        return moment(moment(moment(str).hours(hour)).minutes(0)).format("YYYY-MM-DD HH:mm");
    }

    static mandatoryDayAdd(str, hour) {
        let day = moment(str).days() + 1;
        return moment(moment(moment(moment(str).hours(hour)).minutes(0)).days(day)).format("YYYY-MM-DD HH:mm");
    }


    static isBefores(str1, str2) {
        console.log('str1:' + str1);
        var time1 = str1.split(' ')[1];
        // var time1 =moment(str1,"HH:mm").format("HH:mm:ss");
        console.log('time1' + time1);
        console.log('time2' + str2);
        var time2 = moment(str2, "HH:mm").format("HH:mm:ss");
        console.log('time2' + time2);

        // moment(time1,'HH:mm').isBefore(moment(time2,'HH:mm:ss'))
        // moment('2018-10-10 10:10:10','HH:mm').format('YYYY-MM-DD HH:mm');
        return moment(time1, 'HH:mm').isBefore(moment(time2, 'HH:mm:ss'));

    }

    static isAfters(str1, str2) {
        console.log('str1a:' + str1);
        var time1 = str1.split(' ')[1];
        // var time1 =moment(str1,"HH:mm").format("HH:mm:ss");
        console.log('time1a' + time1);
        console.log('time2a' + str2);
        var time2 = moment(str2, "HH:mm").format("HH:mm:ss");
        console.log('time2a' + time2);

        // moment(time1,'HH:mm').isBefore(moment(time2,'HH:mm:ss'))
        // moment('2018-10-10 10:10:10','HH:mm').format('YYYY-MM-DD HH:mm');
        return moment(time1, 'HH:mm').isAfter(moment(time2, 'HH:mm:ss'));

    }


}

module.exports = DateUtil;