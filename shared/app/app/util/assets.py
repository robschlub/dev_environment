from flask_assets import Bundle, Environment
from .. import app

bundles = {

    # 'compiled_map_js': Bundle(
    #     'build/main.bundle.js.map',
    #     output='dist/main.bundle.js.map'),

    'main_js': Bundle(
        'build/main.bundle.js',
        output='dist/main.bundle.js'),

    # 'tools_map_js': Bundle(
    #     'build/tools.bundle.js.map',
    #     output='dist/tools.bundle.js.map'),

    'tools_js': Bundle(
        'build/tools.bundle.js',
        output='dist/tools.bundle.js'),
}

assets = Environment(app)

assets.register(bundles)
