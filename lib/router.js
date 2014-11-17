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
Router.route('testgroup', {name: 'testgroup'}); //Temporary for demo purpose. TODO: remove this when demo not needed.

Router.onBeforeAction('dataNotFound', {only: 'testplanPage'});
