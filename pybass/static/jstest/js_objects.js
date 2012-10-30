
Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
}

function debugStr(str) {
    document.writeln(str + "<br />");
}

function debugHash(hash) {
    var myHashtable = hash;
    document.writeln("<b>object/hash contents:</b><br />");
    for (var n in myHashtable) { 
        if (myHashtable.hasOwnProperty(n)) { 
            document.writeln("    " + n + ": " + myHashtable[n] + "<br />"); 
        } 
    } 
}

var PyBass = {};

PyBass.Fretboard = function () {
    var bob = this.bob = ["blablabla"];
}

fb = new PyBass.Fretboard();

debugHash(fb);

fb.bob = "Muhahahaha!!!";

debugStr(fb.bob);

debugHash(fb);
