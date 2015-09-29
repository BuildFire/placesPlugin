Number.prototype.toRad = function () {
    return this * (Math.PI / 180);
};

function calculateDistance(coordA, coordB, isKM) {

    var R = 6371; // km
    var dLat = (coordB[1] - coordA[1]).toRad();
    var dLon = (coordB[0] - coordA[0]).toRad();
    var lat1 = coordA[1].toRad();
    var lat2 = coordB[1].toRad();

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d;

    if (isKM) {
        d = R * c;
    }
    else {
        d = R * c * 0.621371;
    }

    return d;
}

