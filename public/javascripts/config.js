requirejs.config({
    baseUrl: '/javascripts',
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'hammer': {
            deps: ['jquery'],
            exports: 'hammer'
        },
        'chart': {
            exports: 'Chart'
        }
    },
    paths: {
        jquery:     'components/jquery/jquery',
        backbone:   'components/backbone/backbone',
        underscore: 'components/underscore/underscore',
        text:       'components/text/text'
    }
});
