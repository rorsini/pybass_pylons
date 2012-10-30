from pyramid.view import view_config

import mingus.core.scales

from formencode import Schema, validators
from pyramid_simpleform import Form
from pyramid_simpleform.renderers import FormRenderer

from pprint import pprint


class MyModelSchema(Schema):
    filter_extra_fields = True
    allow_extra_fields = True
    name = validators.MinLength(5, not_empty=True)
    value = validators.Int(not_empty=True)

class MyModel(object):
    pass

@view_config(route_name='data', renderer='json')
def main_view(request):

    chromatic_scale = mingus.core.scales.chromatic("C")
    root_note = "C"
    scale_type = "ionian"
    scale_display = "note_names"
    # Terse url vars for compact url's:
    #   r = "root note"
    #   t = "scale type"
    #   d = "display style"
    if request.params.has_key('r'):
        root_note = request.params['r']
    if request.params.has_key('t'):
        scale_type = request.params['t']
    if request.params.has_key('d'):
        scale_display = request.params['d']

    scale_display_types = [["notes", "Notes"], 
                           ["degrees", "Degrees"],
                           ["chord", "Chord Tones"]]

    scales = {
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
    scale_types = [[x, scales[x]['display']] for x in scales.keys()]

    unicode_notes = getattr(mingus.core.scales, scale_type)(root_note)
    unicode_notes = map(lambda x: 'A' if x=='Bbb' else x, unicode_notes)
    unicode_notes = map(lambda x: 'B' if x=='Cb' else x, unicode_notes)
    unicode_notes = map(lambda x: 'C' if x=='Dbb' else x, unicode_notes)
    unicode_notes = map(lambda x: 'D' if x=='Ebb' else x, unicode_notes)
    unicode_notes = map(lambda x: 'E' if x=='Fb' else x, unicode_notes)
    unicode_notes = map(lambda x: 'F' if x=='Gbb' else x, unicode_notes)
    unicode_notes = map(lambda x: 'G' if x=='Abb' else x, unicode_notes)

    notes = [str(x) for x in unicode_notes]

    return dict(dict(notes=notes,
                     scale_types = scale_types,
                     scales = scales,
                     scale_display_types = scale_display_types,
                     chromatic_scale = chromatic_scale,
                     root_note = root_note,
                     scale_type = scale_type,
                     scale_display = scale_display))

@view_config(route_name='main', renderer='main.mako')
def test_view(request):

    data = main_view(request)

    if request.params.has_key('r'):
        data['root_note'] = request.params['r']
    if request.params.has_key('t'):
        data['scale_type'] = request.params['t']
    if request.params.has_key('d'):
        data['scale_display'] = request.params['d']

    scale_display_types = [["notes", "Notes"], 
                           ["degrees", "Degrees"],
                           ["chord", "Chord Tones"]]

    form = Form(request, MyModelSchema, defaults={"name" : "foo"})
    renderer=FormRenderer(form)

    data['renderer'] = renderer
    return dict(data=data)


@view_config(route_name='test', renderer='test.mako')
def another_test_view(request):
    data={}
    return dict(data=data)

