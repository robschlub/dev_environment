from flask_assets import Bundle, Environment
from .. import app

bundles = {

    # 'compiled_map_js': Bundle(
    #     'build/main.bundle.js.map',
    #     output='build/main.bundle.js.map'),

    'compiled_js': Bundle(
        'build/main.bundle.js',
        output='build_flask_gen/main.bundle.js'),
}

assets = Environment(app)

assets.register(bundles)
