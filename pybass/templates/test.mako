
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">

<html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>untitled</title>
        <meta name="generator" content="Vim http://vim.org/">
        <meta name="author" content="Rob Orsini">
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
        <script language="javascript" type="text/javascript">

            $.getJSON("http://pybass.com:8080/main",
                { format: "json" },
                function(data) {
                    alert(data.notes);
                }
            );

        </script>
    </head>
    <body>

        <div id="results"></div>
    </body>
</html>

<h1>test.mako</h1>


