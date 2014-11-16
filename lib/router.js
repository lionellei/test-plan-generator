Router.configure({
    layoutTemplate: 'layout'
});

// Routes
Router.route('/', {name: 'dashboard'});
Router.route('/pads', {name: 'padsList'});
Router.route('/new_test_plan', {name: 'newTestPlan'});