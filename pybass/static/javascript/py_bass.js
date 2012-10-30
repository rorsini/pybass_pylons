// frequency of each note (http://www.contrabass.com/pages/frequency.html)

Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
}


var PyBass = {};


PyBass.Fretboard = function (paper, fb_length, fb_width) {

    function hPosOffset(pos) { return pos - 24; }

    function vPosOffset(pos) { return pos - 10; }

    var fret = this.fret = [30, 114, 194, 269,
                            339, 406, 469, 529,
                            585, 638, 688, 735,
                            780, 822, 862, 899,
                            935, 968, 1000, 1029, 1058].map(hPosOffset);

    var strng = this.strng = [NaN, 12.5, 37.5, 62.5, 87.5].map(vPosOffset);

    function mapCoords(coords) { return [fret[coords[0]], strng[coords[1]]]; }

    // See "Color Music" for more info on note colors:
    // http://mycolormusic.com/2009/07/25/the-chromatic-scale-again/
    //
    this.note_colors = { 'C':  '#ca0d3c', 'Cb': '#ca0d3c',
                         'G':  '#e43a23',
                         'D':  '#ec6f21',
                         'A':  '#f6ac1a',
                         'E':  '#ebda10',
                         'B':  '#97c82b',
                         'Gb': '#36a938', 'F#': '#36a938',
                         'Db': '#009a82', 'C#': '#009a82',
                         'Ab': '#0084d4', 'G#': '#0084d4',
                         'Eb': '#2f4d9e', 'D#': '#2f4d9e',
                         'Bb': '#6d2a86', 'A#': '#6d2a86',
                         'F':  '#970a7c', 'E#': '#970a7c', };

    this.scale_degree_color = '#2f4d9e';
    this.scale_degree_root_color = '#69baea';

    this.scale_degree_stroke_color = '#69baea';
    this.scale_degree_root_stroke_color = '#333';

    this.note_name_stroke_color = '#4b4b4b';
    this.note_name_root_stroke_color = '#000';

    this.notes = {};

    this.notes['C'] =  {'coords': [[3,3], [5,1], [8,4], [10,2], [15,3], [17,1], [20,4]].map(mapCoords)};
    this.notes['C#'] = {'coords': [[4,3], [6,1], [9,4], [11,2], [16,3], [18,1]].map(mapCoords)};
    this.notes['Db'] = this.notes['C#']
    this.notes['D'] =  {'coords': [[0,2], [5,3], [7,1], [10,4], [12,2], [17,3], [19,1]].map(mapCoords)};
    this.notes['D#'] = {'coords': [[1,2], [6,3], [8,1], [11,4], [13,2], [18,3], [20,1]].map(mapCoords)};
    this.notes['Eb'] = this.notes['D#']
    this.notes['E'] =  {'coords': [[0,4], [2,2], [7,3], [9,1], [12,4], [14,2], [19,3]].map(mapCoords)};
    this.notes['Fb'] = this.notes['E']
    this.notes['F'] =  {'coords': [[1,4], [3,2], [8,3], [10,1], [13,4], [15,2], [20,3]].map(mapCoords)};
    this.notes['F#'] = {'coords': [[2,4], [4,2], [9,3], [11,1], [14,4], [16,2]].map(mapCoords)};
    this.notes['Gb'] = this.notes['F#']
    this.notes['G'] =  {'coords': [[0,1], [3,4], [5,2], [10,3], [12,1], [15,4], [17,2]].map(mapCoords)};
    this.notes['G#'] = {'coords': [[1,1], [4,4], [6,2], [11,3], [13,1], [16,4], [18,2]].map(mapCoords)};
    this.notes['Ab'] = this.notes['G#']
    this.notes['A'] =  {'coords': [[0,3], [2,1], [5,4], [7,2], [12,3], [14,1], [17,4], [19,2]].map(mapCoords)};
    this.notes['A#'] = {'coords': [[1,3], [3,1], [6,4], [8,2], [13,3], [15,1], [18,4], [20,2]].map(mapCoords)};
    this.notes['Bb'] = this.notes['A#']
    this.notes['B'] =  {'coords': [[2,3], [4,1], [7,4], [9,2], [14,3], [16,1], [19,4]].map(mapCoords)};
    this.notes['Cb'] = this.notes['B']

    var fb_length = 1070;
    var fb_width = 100;
    var string_spacing = fb_width / 4;
    var total_frets = 20;
    var distance_above_nut = 30;
    var fret_marker_radius = 7;
    var fret_marker_color = '#000';
    var fret_marker_opacity = '1';
    var position_color = 'green';

    // Background:
    var background = paper.rect(-10, 0, fb_length + 8, fb_width-1, 10);
    background.attr({stroke: '#d7b14a',
                     'stroke-width': '4',
                     gradient: '90-#e1b94e-#ffdd83'});

    var background_bottom_border = paper.path("M 0 " + (fb_width-1) + " l " + (fb_length-7) + " 0");
    background_bottom_border.attr({stroke: '#be8b00', 'stroke-width': '3'});

    
    var nut = paper.rect(distance_above_nut, 0, 5, fb_width);
    nut.attr({stroke: 'none', fill: '#444'});

    var nut_shadow = paper.path("M " + ( distance_above_nut + 5 ) + " 0 l 0 " + fb_width);
    nut_shadow.attr({stroke: '#c5a54e', 
                    'stroke-width': 2,
                    opacity: '0.5'});

    // Frets:
    var previous_d = 0;
    for(var fret = 0; fret < total_frets; fret+=1) {
        var fret_num = fret + 1;
        var length = 1500;
        var d = Math.round(length - (length / Math.pow(2, ((fret+1) / 12))) + distance_above_nut);
        p = " M " + d + " 0 l 0 " + fb_width;

        if (fret_num == 3) { var circ = paper.circle(previous_d + ( d - previous_d )/2, (fb_width/2), fret_marker_radius).attr({fill: fret_marker_color, stroke: 'none', opacity: fret_marker_opacity}); }
        if (fret_num == 5) { var circ = paper.circle(previous_d + ( d - previous_d )/2, (fb_width/2), fret_marker_radius).attr({fill: fret_marker_color, stroke: 'none', opacity: fret_marker_opacity}); }
        if (fret_num == 7) { var circ = paper.circle(previous_d + ( d - previous_d )/2, (fb_width/2), fret_marker_radius).attr({fill: fret_marker_color, stroke: 'none', opacity: fret_marker_opacity}); }
        if (fret_num == 9) { var circ = paper.circle(previous_d + ( d - previous_d )/2, (fb_width/2), fret_marker_radius).attr({fill: fret_marker_color, stroke: 'none', opacity: fret_marker_opacity}); }

        if (fret_num == 12) { 
            var circ = paper.circle(previous_d + ( d - previous_d )/2, (fb_width/4), fret_marker_radius).attr({fill: fret_marker_color, stroke: 'none', opacity: fret_marker_opacity}); 
            var circ = paper.circle(previous_d + ( d - previous_d )/2, (fb_width-(fb_width/4)), fret_marker_radius).attr({fill: fret_marker_color, stroke: 'none', opacity: fret_marker_opacity}); 
        }

        if (fret_num == 15) { var circ = paper.circle(previous_d + ( d - previous_d )/2, (fb_width/2), fret_marker_radius).attr({fill: fret_marker_color, stroke: 'none', opacity: fret_marker_opacity}); }
        if (fret_num == 17) { var circ = paper.circle(previous_d + ( d - previous_d )/2, (fb_width/2), fret_marker_radius).attr({fill: fret_marker_color, stroke: 'none', opacity: fret_marker_opacity}); }
        if (fret_num == 19) { var circ = paper.circle(previous_d + ( d - previous_d )/2, (fb_width/2), fret_marker_radius).attr({fill: fret_marker_color, stroke: 'none', opacity: fret_marker_opacity}); }

        var bass_fret = paper.path(p);
        bass_fret.attr({stroke: '#444', 'stroke-width': 2});

        var bass_fret_shadow = paper.path("M " + ( d + 1 ) + " 0 l 0 " + fb_width);
        bass_fret_shadow.attr({stroke: '#222', 'stroke-width': 1});

        var bass_fret_shadow_two = paper.path("M " + ( d + 2 ) + " 0 l 0 " + fb_width);
        bass_fret_shadow_two.attr({stroke: '#c5a54e', 
                                   'stroke-width': 2,
                                   opacity: '0.5'});


        //var fret_text = paper.text(d + 14, 4, d);
        //fret_text.attr({fill: position_color});

        previous_d = d;
    }

    // Strings:
    var this_string_spacing = 12.5;
    for(var i = 0; i < 4; i+=1) {
        var bass_string = paper.path("M 0 " + this_string_spacing + " l " + fb_length + " 0");
        bass_string.attr({stroke: '#888', 'stroke-width': 4});

        var bass_string_shadow = paper.path("M 0 " + (this_string_spacing - 0.5) + " l " + fb_length + " 0");
        bass_string_shadow.attr({stroke: '#e2e2e2', 'stroke-width': 0.8});

        //var string_text = paper.text(47, this_string_spacing + 6, this_string_spacing);
        //string_text.attr({fill: position_color});

        this_string_spacing += string_spacing;
    }
}


PyBass.Piano = function (paper, scale) {

    var scale = scale;
    if ( typeof scale == "string" ) {
        scale = [scale];
    }
    var chord_tones = [];
    for (scale_index in scale) {
        //alert(scale_index);
        if (scale_index % 2 != 0) {
            continue;
        } else {
            chord_tones[scale_index] = scale[scale_index];
        }
    }
    scale = chord_tones;

    note_colors = { 'C':  '#ca0d3c', 'Cb': '#ca0d3c',
                    'G':  '#e43a23',
                    'D':  '#ec6f21',
                    'A':  '#f6ac1a',
                    'E':  '#ebda10',
                    'B':  '#97c82b',
                    'Gb': '#36a938', 'F#': '#36a938',
                    'Db': '#009a82', 'C#': '#009a82',
                    'Ab': '#0084d4', 'G#': '#0084d4',
                    'Eb': '#2f4d9e', 'D#': '#2f4d9e',
                    'Bb': '#6d2a86', 'A#': '#6d2a86',
                    'F':  '#970a7c', 'E#': '#970a7c', };

    function getColor(note, scale) {
        var notes = note;
        if ( typeof note == "string" ) {
            notes = [note];
        }
        for ( note_index in notes ) {
            note = notes[note_index];
            for ( scale_index in scale ) {
                if ( scale[scale_index] == note ) {
                    if (scale_index == 0) {
                        return "#8833ff";
                    }
                    // return note_colors[note];
                    if ( note.length > 1 ) {
                        return "#1199ff";
                    } else {
                        return "#77aaff";
                    }
                }
            }
        }
        if ( note.length > 1 ) {
            return "#000";
        } else {
            return "#fff";
        }
    }

    var xOffSet = 4;
    var yOffSet = 4;

    var c1  = paper.rect(xOffSet +  0, yOffSet, 20, 90, 2).attr({fill: getColor('C', scale)});
    var d1  = paper.rect(xOffSet + 20, yOffSet, 20, 90, 2).attr({fill: getColor('D', scale)});
    var e1  = paper.rect(xOffSet + 40, yOffSet, 20, 90, 2).attr({fill: getColor('E', scale)});
    var f1  = paper.rect(xOffSet + 60, yOffSet, 20, 90, 2).attr({fill: getColor('F', scale)});
    var g1  = paper.rect(xOffSet + 80, yOffSet, 20, 90, 2).attr({fill: getColor('G', scale)});
    var a1  = paper.rect(xOffSet +100, yOffSet, 20, 90, 2).attr({fill: getColor('A', scale)});
    var b1  = paper.rect(xOffSet +120, yOffSet, 20, 90, 2).attr({fill: getColor('B', scale)});

    var c2  = paper.rect(xOffSet +140, yOffSet, 20, 90, 2).attr({fill: getColor('C', scale)});
    var d2  = paper.rect(xOffSet +160, yOffSet, 20, 90, 2).attr({fill: getColor('D', scale)});
    var e2  = paper.rect(xOffSet +180, yOffSet, 20, 90, 2).attr({fill: getColor('E', scale)});
    var f2  = paper.rect(xOffSet +200, yOffSet, 20, 90, 2).attr({fill: getColor('F', scale)});
    var g2  = paper.rect(xOffSet +220, yOffSet, 20, 90, 2).attr({fill: getColor('G', scale)});
    var a2  = paper.rect(xOffSet +240, yOffSet, 20, 90, 2).attr({fill: getColor('A', scale)});
    var b2  = paper.rect(xOffSet +260, yOffSet, 20, 90, 2).attr({fill: getColor('B', scale)});

    var c1s = paper.rect(xOffSet + 14, yOffSet, 12, 70, 2).attr({fill: getColor(['C#','Db'], scale)});
    var d1s = paper.rect(xOffSet + 34, yOffSet, 12, 70, 2).attr({fill: getColor(['D#','Eb'], scale)});
    var f1s = paper.rect(xOffSet + 74, yOffSet, 12, 70, 2).attr({fill: getColor(['F#','Gb'], scale)});
    var g1s = paper.rect(xOffSet + 94, yOffSet, 12, 70, 2).attr({fill: getColor(['G#','Ab'], scale)});
    var a1s = paper.rect(xOffSet +114, yOffSet, 12, 70, 2).attr({fill: getColor(['A#','Bb'], scale)});

    var c2s = paper.rect(xOffSet +154, yOffSet, 12, 70, 2).attr({fill: getColor(['C#','Db'], scale)});
    var d2s = paper.rect(xOffSet +174, yOffSet, 12, 70, 2).attr({fill: getColor(['D#','Eb'], scale)});
    var f2s = paper.rect(xOffSet +214, yOffSet, 12, 70, 2).attr({fill: getColor(['F#','Gb'], scale)});
    var g2s = paper.rect(xOffSet +234, yOffSet, 12, 70, 2).attr({fill: getColor(['G#','Ab'], scale)});
    var a2s = paper.rect(xOffSet +254, yOffSet, 12, 70, 2).attr({fill: getColor(['A#','Bb'], scale)});
}


function debugHash(hash) {
    var myHashtable = hash;
    document.writeln("<b>object/hash contents:</b><br />");
    for (var n in myHashtable) { 
        if (myHashtable.hasOwnProperty(n)) { 
            document.writeln(" " + n + ": " + myHashtable[n] + "<br />"); 
        } 
    } 
}


function drawNotes(paper, fretboard, note_list, style) {
    var scale_degree = 1;
    for (note in note_list) {
        var note_name = note_list[note];
        for (index in fretboard.notes[note_name]['coords']) {
            pos = fretboard.notes[note_name]['coords'][index];
            var fret_num = pos[0] + 10;
            var string_num = pos[1] + 10;
            var note_color = fretboard.note_colors[note_name];
            var note_label = note_name;
            var text_color = 'black';
            var stroke_color = fretboard.note_name_stroke_color;

            if (style && ( style == "degrees" || style == "chord")) {

                if (style == "chord") {
                    if (scale_degree % 2 == 0) {
                        continue;
                    }
                }

                text_color = '#eee';
                if (scale_degree == 1) {
                    note_color = fretboard.scale_degree_root_color;
                    stroke_color = fretboard.scale_degree_root_stroke_color;
                    text_color = '#000';
                } else {
                    note_color = fretboard.scale_degree_color;
                    note_label = scale_degree;
                    stroke_color = fretboard.scale_degree_stroke_color;
                }
            } else {
                if (scale_degree == 1) {
                    stroke_color = fretboard.note_name_root_stroke_color;
                }
            }
            drawNote(paper, 
                     fret_num, 
                     string_num, 
                     note_label, 
                     note_color,
                     text_color,
                     scale_degree,
                     stroke_color);
        }
        scale_degree++;
    }
}


function drawNote(paper, xpos, ypos, label, note_color, text_color, scale_degree, stroke_color) {
    //var circle = paper.circle(xpos, ypos, 10);
    var circle = paper.rect(xpos-11, ypos-10, 20, 20, 4);
    var stroke_width = 1;
    if (scale_degree == 1) {
        stroke_width = 3;
    }
    circle.attr({'fill': note_color,
                 'stroke': stroke_color,
                 'stroke-width': stroke_width,
                 'opacity': 1,
                 'stroke-opacity': 1});

    var fontSize = '13px';
    var text_ypos = ypos-2;
    if ( label.length == 2 ) {
        fontSize = '10px';
        text_ypos += 1;
        text_color = '#eee';
    }
    var t = paper.text(xpos-1, text_ypos, label);

    t.attr('fill', text_color);
    t.attr('font-size', fontSize);
    t.attr('font-weight', 'bold');
}

