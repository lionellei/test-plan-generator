Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound'
});

// Routes
Router.route('/', {name: 'dashboard'});

// Shows all the test plans
Router.route('/testplans', {
    name: 'testplans',
    waitOn: function() {
        return [
            Meteor.subscribe('testplans')
        ];
    },
    data: function () {
       return Testplans.find();
    }
});

// Order matters, place this route before the testplanPage route, otherwise /pads will be interpret as :revision
Router.route('/testplans/:chipName/:revision/pads', { // include the :revision here for template to allow or disable edit. But all versions past list should be the same per chip.
    name: 'padsList',
    waitOn: function() {
        return [
            Meteor.subscribe('pads', this.params.chipName)
        ];
    },
    data: function () {
        return Pads.find({chipName:this.params.chipName});
    }
});

Router.route('/testplans/:chipName/:revision/registers', {
    name: 'registersList',
    waitOn: function() {
        return [
            Meteor.subscribe('registers', this.params.chipName)
        ];
    },
    data: function () {
        return Registers.find({chipName:this.params.chipName});
    }
});

// Test plan of chipName
Router.route('/testplans/:chipName/:revision', {
    name: 'testplanPage',
    waitOn: function() {
        return [
            Meteor.subscribe('testplans'),
            Meteor.subscribe('pads', this.params.chipName),
            Meteor.subscribe('registers', this.params.chipName),
            Meteor.subscribe('testgroups', this.params.chipName, Number(this.params.revision))
        ];
    },
    data: function () {
        // make sure to convert the :revision to number because it's Number in schema
        return Testplans.findOne({chipName: this.params.chipName, revision:Number(this.params.revision)});
    }
});

// The test group of test plan of chipName
Router.route('/testplans/:chipName/:revision/tests/:name', { // use :name to denote the testgroupName because that's the attribute testgroup object has, this allow passing this into pathFor
    name: 'testgroup',
    waitOn: function() {
        return [
            // Need this to display the test setups
            Meteor.subscribe('setups', this.params.chipName, this.params.name, Number(this.params.revision)),
            // Need this for test notes.
            Meteor.subscribe('notes', this.params.chipName, this.params.name, Number(this.params.revision)),
            // Need this for test headers.
            Meteor.subscribe('testHeaderConfigs', this.params.chipName, this.params.name, Number(this.params.revision)),
            // Need this to find the current test group.
            Meteor.subscribe('currentTestGroup',  this.params.chipName, this.params.name, Number(this.params.revision)),
            // Need this for pads input auto complete.
            Meteor.subscribe('pads', this.params.chipName),
            // Need this for registers auto complete.
            Meteor.subscribe('registers', this.params.chipName),
            // Need this for the test items:
            Meteor.subscribe('testitems', this.params.chipName, this.params.name, Number(this.params.revision))
            
        ];
    },
    data: function () {
        // This piece of code will cause problem because it depends on server return the testgroup object
        // var testgroup = Testgroups.findOne({chipName:this.params.chipName, name:this.params.name});
        // for now use :chipName and :name to locate TODO: figure out a way to wait for testgroup return
        return Testitems.find({ chipName:this.params.chipName, 
                                testgroupName:this.params.name, 
                                revision:Number(this.params.revision)},{sort: {order: 1}});
    },
    onStop: function () {
        Session.set('selectedRowsIds', []);
        Session.set('modifiedAttributeAllowedValue', "");
        Session.set('selectedAttributeIsPad', false);
    }
});

var requireLogin = function() {
    if (! Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
};

Router.onBeforeAction('dataNotFound', {only: 'testplanPage'});
Router.onBeforeAction(requireLogin);
