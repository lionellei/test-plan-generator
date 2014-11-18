Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound'
});

// Routes
Router.route('/', {name: 'dashboard'});

// Shows all the test plans
Router.route('/testplans', {
   name: 'testplans',
   data: function () {
       return Testplans.find();
   }
});

// Test plan of chipName
Router.route('/testplans/:chipName', {
    name: 'testplanPage',
    data: function () {
        return Testplans.findOne({chipName: this.params.chipName});
    }
});

// The test group of test plan of chipName
Router.route('/testplans/:chipName/:testgroupName', {
    name: 'testgroup',
    data: function () {
        // This piece of code will cause problem because it depends on server return the testgroup object
        // var testgroup = Testgroups.findOne({chipName:this.params.chipName, name:this.params.testgroupName});
        // for now use :chipName and :testgroupName to locate TODO: figure out a way to wait for testgroup return
        return Testitems.find({chipName:this.params.chipName, testgroupName:this.params.testgroupName});
    }
});

Router.route('/testplans/:chipName/pads', {
    name: 'padsList',
    data: function () {
        return Pads.find({chipName:this.params.chipName});
    }
});

Router.onBeforeAction('dataNotFound', {only: 'testplanPage'});
