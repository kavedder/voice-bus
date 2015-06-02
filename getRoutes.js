function getRoutes(doc, bus_id, spoken_form) {
    // TODO: the "all" version!
    var routes = doc.getElementsByTagName("arrivalAndDeparture");
    var arr = [];
    var longName;
    var destination;
    for (i=0; i<routes.length; i++) {
        var element = routes.item(i);
        try {
            var short_name = element.getElementsByTagName("routeShortName").item(0).firstChild.data;
        }
        catch(err) {
            var short_name = "foo";
        }
        if (short_name == bus_id) {
            return "YEAH!";
            if (!destination) {
                // haven't grabbed the destination yet
                try {
                    longName = element.getElementsByTagName("routeLongName").item(0).firstChild.data;
                }
                catch(err) {
                    longName = makeLong(spoken_form);
                }
                try {
                    destination = element.getElementsByTagName("tripHeadsign").item(0).firstChild.data;
                }
                catch(err) {
                    destination = "Mars";
                }
            }
            //predictedArrivalTime
            try {
                var arrTime = element.getElementsByTagName("predictedArrivalTime").item(0).firstChild.data;
            }
            catch(err) {
                return "Boobles.";
            }
            var time = getTimeDiff(arrTime);
            if (time) {
                arr.push(time);
            }
        }
    }
    var arrival_pl = "arrivals";
    var verb = "are";
    if (arr.length === 0) {
        return ("I'm sorry. I can't find any upcoming arrivals of the " + bus_id + " at this stop.");
    }
    else if (arr.length == 1) {
        arrival_pl = "arrival";
    }
    var s = "The next " + arrival_pl + " of the " + longName + " to " + destination + " " + verb;
    for (var i=0; i<arr.length; i++) {
        s += " in about " + arr[i] + ", ";
    }
    return s;
}

function makeLong(spoken_form) {
    var substrings = spoken_form.split(" ");
    var first_word = substrings[0];
    if (first_word != "the" ) {
        substrings.unshift("the")
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
        return diff_secs + " seconds";
    }
    var diff_mins = diff_secs/60;
    var diff_remain = diff_secs % 60;
    if (diff_remain <= 20) {
        return diff_mins;
    }
    else if (20 < diff_remain < 40) {
        return diff_mins + "and a half minutes";
    }
    return diff_mins + 1 + " minutes";
}
