function getRoutes(doc, bus_id, spoken_form) {
    // TODO: the "all" version!
    var routes = doc.getElementsByTagName("arrivalAndDeparture");
    var arr = [];
    var longName;
    var destination;
    var shortName;
    var arrTime;
    for (i=0; i<routes.length; i++) {
        var element = routes.item(i);
        try {
            shortName = element.getElementsByTagName("routeShortName").item(0).firstChild.data;
        }
        catch(err) {
            shortName = spoken_form;
        }
        if (shortName == bus_id) {
            if (!destination) {
                // haven't grabbed the destination yet
                try {
                    longName = element.getElementsByTagName("routeLongName").item(0).firstChild.data;
                }
                catch(err) {
                    longName = makeLong(spoken_form);
                }

                try {
                    destination = " to " + element.getElementsByTagName("tripHeadsign").item(0).firstChild.data;
                }
                catch(err) {
                    destination = " ";
                }
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
                arr.push(time);
            }
        }
    }
    if (arr.length === 0) {
        return ("I'm sorry. I can't find any upcoming arrivals of the " + bus_id + " at this stop.");
    }
    var s = "The next arrival of the " + longName + destination + " is  in about " + arr[0] + ". ";
    if (arr.length > 1) {
        if (arr.length > 2) {
            s += "After that, the next arrivals are ";
            for (var i=1; i<arr.length-1; i++) {
                s += " in about " + arr[i] + ", ";
            }
            s += " and in about " + arr[arr.length-1];
        }
        else {
            s += "After that, the next arrival is in about " + arr[arr.length-1];
        }
    }
    return s;
}

function makeLong(spoken_form) {
    var substrings = spoken_form.split(" ");
    var first_word = substrings[0];
    if (first_word != "the" ) {
        substrings.unshift("the");
    }
    return substrings.join(" ");
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
