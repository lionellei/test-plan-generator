Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound'
});

// Routes
Router.route('/', {name: 'dashboard'});
Router.route('/pads', {name: 'padsList'});
Router.route('/testplans/:chipName', {
    name: 'testplanPage',
    data: function () {
        return Testplans.findOne({chipName: this.params.chipName});
    }
});

Router.onBeforeAction('dataNotFound', {only: 'testplanPage'});
