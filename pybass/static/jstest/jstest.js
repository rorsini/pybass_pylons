/*!
 * PyBass JavaScript Library v0.1
 * http://pybass.com/
 *
 * Copyright 2010, Rob Orsini
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Thu Apr 15 11:06:51 PDT 2010
 */

document.writeln('Fretboard Class Testing');
document.writeln('=======================\n');

Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
}

var PyBass = {};

PyBass.Fretboard = function () {
    var fret = this.fret = [13,  74,  124, 168,
                            216, 259, 300, 338,
                            375, 409, 441, 470,
                            497, 523, 549, 575];
    var strng = this.strng = [NaN, 9, 45, 82, 119];

    function mapCoords(coords) {
        return [fret[coords[0]], strng[coords[1]]];
    }

    var c_coords = [[3, 3], [5, 1], [8, 4], [10, 2], [15, 3]];
    this.c_notes = c_coords.map(mapCoords);
}

//Make a Fretboard object:
var fretboard = new PyBass.Fretboard;

document.writeln('strings:\n');

for (strngPos in fretboard.strng) {
    if (strngPos != 0) {
        document.writeln('strng[' + strngPos + ']: ' + 
                         fretboard.strng[strngPos]);
    }
}

document.writeln('\nFrets:\n');

for (fretPos in fretboard.fret) {
    document.writeln('fret[' + fretPos + ']: ' + fretboard.fret[fretPos]);
}

document.writeln('\nAll "c" note positions:\n');

for (index in fretboard.c_notes) {
    pos = fretboard.c_notes[index]
    document.writeln('C position ' + ( parseInt(index) + 1 ) + 
                     ': (fret: ' + pos[0] + ', strng: ' + pos[1] + ')' );
}


