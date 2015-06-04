function getRoutes(doc, bus_id, bus_type) {
    var routes = doc.getElementsByTagName("arrivalAndDeparture");
    var timeArray = [];
    var routeArray = [];
    var longName;
    var destination;
    var shortName;
    var arrTime;
    for (i=0; i<routes.length; i++) {
        var element = routes.item(i);
            shortName = element.getElementsByTagName("routeShortName").item(0).firstChild.data;
        if (shortName == bus_id || bus_type == "all") {
            // gather the name info
            try {
                longName = element.getElementsByTagName("routeLongName").item(0).firstChild.data;
            }
            catch(err) {
                // it's a number!
                longName = makeLong(shortName);
            }
            try {
                destination = " to " + cvtDest(element.getElementsByTagName("tripHeadsign").item(0).firstChild.data);
            }
            catch(err) {
                destination = " ";
            }
            //predictedArrivalTime
            try {
                arrTime = element.getElementsByTagName("predictedArrivalTime").item(0).firstChild.data;
            }
            catch(err) {
                return "I'm sorry. There was an unexpected error with the One Bus Away API call.";
            }
            var time = getTimeDiff(arrTime);
            if (time) {
                timeArray.push(time);
                routeArray.push(longName);
            }
        }
    }
    // syntaxing
    var return_str = "";
    if (bus_type == "all") {
        // syntax for all buses
        if (timeArray.length === 0) {
            return "I'm sorry. I can't find any upcoming arrivals at this stop.";
        }
        return_str = "The next arrival at this stop is the " + routeArray[0] + " in about " + timeArray[0] + ", ";
        if (timeArray.length > 1) {
            return_str += "followed by ";
            for (var i=1; i<timeArray.length; i++) {
                return_str += " the " + routeArray[i] + " in about " + timeArray[i] + ", ";
            }
        }
    }
    else {
        // syntax for a single bus
        if (timeArray.length === 0) {
            return "I'm sorry. I can't find any upcoming arrivals for the " + bus_id + " at this stop.";
        }
        return_str = "The next arrival of the " + longName + destination + " is  in about " + timeArray[0] + ". ";
        if (timeArray.length > 1) {
            if (timeArray.length > 2) {
                return_str += "After that, the next arrivals are ";
                for (var i=1; i<timeArray.length-1; i++) {
                    return_str += " in about " + timeArray[i] + ", ";
                }
                return_str += " and in about " + timeArray[arr.length-1];
            }
            else {
                return_str += "After that, the next arrival is in about " + timeArray[timeArray.length-1];
            }
        }
    }
    return_str += ". ";
    return return_str;
}


function cvtDest(dest) {
    var wordConvert = {
        "Ln": "Lane",
        "St": "Street",
        "Blvd": "Boulevard",
        "Ave": "Avenue",
        "Wy": "Way",
        "Pkwy": "Parkway",
        "Rd": "Road",
        "NE": "northeast",
        "NW": "northwest",
        "SE": "southeast",
        "SW": "southwest",
        "N": "north",
        "W": "west",
        "S": "south",
        "E": "east",
        "Mt": "Mount",
        "Ln.": "Lane",
        "St.": "Street",
        "Blvd.": "Boulevard",
        "Ave.": "Avenue",
        "Wy.": "Way",
        "Pkwy.": "Parkway",
        "Rd.": "Road",
        "NE.": "northeast",
        "NW.": "northwest",
        "SE.": "southeast",
        "SW.": "southwest",
        "N.": "north",
        "W.": "west",
        "S.": "south",
        "E.": "east",
        "Mt.": "Mount"
    };
    var words = dest.split(" ");
    var converted = "";
    for (var i=0; i<words.length; i++) {
        word = words[i];
        convertedWord = wordConvert[word] || word;
        converted += " " + convertedWord;
    }
    return converted;
}

function makeLong(busno) {
    // just in case?
    var chars = busno.toString().trim().split('');
    var longno;
    if (chars.length == 4) {
        longno = chars[0]+chars[1]+" "+chars[2]+chars[3];
    }
    else if (chars.length == 3) {
        longno = chars[0]+" "+chars[1]+chars[2];
    }
    else {
        longno=chars[0]+chars[1];
    }
    var minus_2 = longno.length - 2;
    var minus_1 = minus_2 + 1;
    if (longno.slice(minus_2,minus_1) == '0') {
        longno = longno.slice(0,minus_2) + "oh " + longno.slice(minus_1);
    }
    return longno;
}

function getTimeDiff(timestr) {
    var now = new Date().getTime();
    var diff = timestr-now;
    if (diff < 0) {
        // you've missed the bus!
        return null;
    }
    var diff_secs = diff / 1000;
    if (diff_secs < 60) {
        return parseInt(diff_secs) + " seconds";
    }
    var diff_mins = diff_secs/60;
    var diff_remain = diff_secs % 60;
    if (diff_remain <= 20) {
        // round down to minutes
        return parseInt(diff_mins) + " minutes";
    }
    else if (20 < diff_remain < 40) {
        return parseInt(diff_mins) + "and a half minutes";
    }
    return parseInt(diff_mins) + 1 + " minutes";
}
