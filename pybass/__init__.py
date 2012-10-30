from pyramid.config import Configurator

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings)
    #config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_static_view('static', 'static', cache_max_age=0)
    config.add_route('data', '/data')
    config.add_route('test', '/test')
    config.add_route('main', '/')
    config.scan()
    return config.make_wsgi_app()
