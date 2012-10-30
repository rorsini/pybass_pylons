pass

import logging

from pylons import request, response, session, tmpl_context as c, url
from pylons.controllers.util import abort, redirect

from pybass_com.lib.base import BaseController, render

# move this to base:
import mingus.core.scales as scales

from subprocess import call, Popen, PIPE, STDOUT

log = logging.getLogger(__name__)

class MainController(BaseController):

    def index(self):
        c.chromatic_scale = scales.chromatic("C")
        c.root_note = "C"
        c.scale_type = "ionian"
        c.scale_display = "note_names"
        # Terse url vars for compact url's:
        #   r = "root note"
        #   t = "scale type"
        #   d = "display style"
        if request.params.has_key('r'):
            c.root_note = request.params['r']
        if request.params.has_key('t'):
            c.scale_type = request.params['t']
        if request.params.has_key('d'):
            c.scale_display = request.params['d']

        c.scale_display_types = [["notes", "Notes"], 
                                 ["degrees", "Degrees"],
                                 ["chord", "Chord Tones"]]

        c.scales = {
                    'aeolian': 
                        { 'display': 'Aeolian' },
                    'chromatic':
                        { 'display': 'Chromatic' },
                    'diminished':
                        { 'display': 'Diminished' },
                    'dorian':
                        { 'display': 'Dorian' },
                    'harmonic_minor':
                        { 'display': 'Harmonic Minor' },
                    'ionian':
                        { 'display': 'Major / Ionian' },
                    'locrian':
                        { 'display': 'Locrian' },
                    'lydian':
                        { 'display': 'Lydian' },
                    'melodic_minor':
                        { 'display': 'Melodic Minor' },
                    'mixolydian':
                        { 'display': 'Mixolydian' },
                    'natural_minor':
                        { 'display': 'Natural Minor' },
                    'phrygian':
                        { 'display': 'Phrygian' },
                    'whole_note':
                        { 'display': 'Whole Note' },
                   }

        c.scale_types = [[x, c.scales[x]['display']] for x in c.scales.keys()]

        unicode_notes = getattr(scales, c.scale_type)(c.root_note)
        unicode_notes = map(lambda x: 'A' if x=='Bbb' else x, unicode_notes)
        unicode_notes = map(lambda x: 'B' if x=='Cb' else x, unicode_notes)
        unicode_notes = map(lambda x: 'C' if x=='Dbb' else x, unicode_notes)
        unicode_notes = map(lambda x: 'D' if x=='Ebb' else x, unicode_notes)
        unicode_notes = map(lambda x: 'E' if x=='Fb' else x, unicode_notes)
        unicode_notes = map(lambda x: 'F' if x=='Gbb' else x, unicode_notes)
        unicode_notes = map(lambda x: 'G' if x=='Abb' else x, unicode_notes)
        c.notes = [str(x) for x in unicode_notes]
        return render('/main/index.mako')


    def make_lily_scale(self, root='A'):
        lilypond_music = """<lilypond relative=1 verbatim>
            \clef bass \key %s \major %s
        </lilypond>
        """ % (root,
               str(' '.join(["%s," % root] + scales.ionian(root)[1:] + [root])))
        return lilypond_music.replace('#', 'is').lower()


    def lilypond(self):

        lilypond_music = self.make_lily_scale()

        with open('/var/www/WSGI_ENV/tmp/music.html', 'w') as f:
            f.write(lilypond_music.lower())

        # Generate lilypond html and graphic:
        cmd1 = ["/var/www/WSGI_ENV/bin/lilypond-book",
                "/var/www/WSGI_ENV/tmp/music.html",
                "-o",
                "/var/www/WSGI_ENV/tmp/output"]
        output1 = Popen(cmd1, stdout=PIPE).communicate()[0] 
        c.cmd1 = cmd1
        c.p1results = output1


        # Find the graphic:
        cmd2 = ["find",
                "/var/www/WSGI_ENV/tmp/output/",
                "-name", 
                "*.png"]
        output2 = Popen(cmd2, stdout=PIPE).communicate()[0] 
        c.cmd2 = cmd2
        c.graphic_path = output2.rstrip()


        # Open permissions on graphic:
        cmd3 = ["chown",
                "rorsini",
                c.graphic_path]
        output3 = Popen(cmd3, stdout=PIPE).communicate()[0] 
        c.cmd3 = cmd3
        c.output3 = output3


        # Move graphic:
        cmd4 = ["mv",
                c.graphic_path,
                "/var/www/WSGI_ENV/WSGI_APPS/pybass.com/latest-release/pybass_com/public/images/music_graphic.png"]
        output4 = Popen(cmd4, stdout=PIPE).communicate()[0] 
        c.cmd4 = cmd4
        c.output4 = output4

        return render('/main/lilypond.mako')



    def get_user(self):

        # Get user:
        cmd = ['whoami']
        output = Popen(cmd, stdout=PIPE).communicate()[0] 
        c.output = output

        return render('/main/test.mako')
