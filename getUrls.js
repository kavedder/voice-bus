function getStopUrl(stopno) {
    // http://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/<id>.xml?key=<key>
    var url_base = "http://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/1_";
    var api_key = "ae9a6989-9371-433b-9914-d8c2f8575b5d";
    var url = url_base + stopno + ".xml?key=" + api_key;
    return url;
}

