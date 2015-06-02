function getStopUrl(stopno) {
    var api_key = "ae9a6989-9371-433b-9914-d8c2f8575b5d";
    var url_base = "http://api.pugetsound.onebusaway.org/api/where/stop/1_";
    var url = url_base + stopno + ".xml?key=" + api_key;
    return url;
}

function getArrDepUrl(stopno) {
    var api_key = "ae9a6989-9371-433b-9914-d8c2f8575b5d";
    var url_base = "http://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/1_";
    var url = url_base + stopno + ".xml?key=" + api_key;
    return url;
}
