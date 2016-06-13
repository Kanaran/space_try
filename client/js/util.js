/**
 * Created by AV01NSF on 13.06.2016.
 */
/* globals Valaran */
Valaran.Util = (function(Date, window, Math, undefined) {
    "use strict";

    var generateUUID = function (){
        var d = Date.now();
        if(window.performance && typeof window.performance.now === "function"){
            d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    };

    return {
        generateUUID: generateUUID
    };
})(Date, window, Math);