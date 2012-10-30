<%inherit file="layouts/site.mako" />

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>

<script language="javascript" type="text/javascript">

    window.onload = function() {

        var pybass_data = [];

        $.getJSON("http://pybass.com:8080/data",
            { format: "json" },
            function(data) {
                pybass_data = data;
            }
        );

        var fretboard_length = 1070;
        var fretboard_width = 100;
        var fretboard_paper = new Raphael(document.getElementById('canvas_container'), fretboard_length, fretboard_width);
        var fretboard = new PyBass.Fretboard(fretboard_paper, fretboard_length, fretboard_width); 

        var piano_length = 600;
        var piano_width = 96;
        var piano_paper = new Raphael(document.getElementById('piano_container'), piano_length, piano_width);
        var piano = new PyBass.Piano(piano_paper, ${str(data['notes']) | n});

        function drawScale(note_list, style) {
            drawNotes(fretboard_paper, fretboard, note_list, style);
        }

        drawScale(${str(data['notes']) | n}, '${str(data['scale_display']) | n}');
    }

    function submitForm() {
        document.scale_select.submit();
    }

</script>

<%
h = data['renderer']
%>

<div id="form_container">
  <form action="${request.route_url('main', action='main')}" name="scale_select" method="get">
      ${h.select('r', data['chromatic_scale'], data['root_note'], onChange="submitForm()")}
      ${h.select('t', data['scale_types'], data['scale_type'], onChange="submitForm()")}
      ${h.select('d', data['scale_display_types'], data['scale_display'], onChange="submitForm()")}
  </form> 
</div>

<div id="canvas_container">
</div>

<div id="piano_container">
</div>

<div id="circle_container">
  <div id="scale_title">
      ${data['root_note']} ${data['scales'][data['scale_type']]['display']}<br />
      <span style="font-size: large;">(${", ".join(data['notes'])})</span>
  </div>

  <img src="/static/images/circle.png" />
</div>

