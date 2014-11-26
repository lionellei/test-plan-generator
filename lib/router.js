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

// Order matters, place this route before the testplanPage route, otherwise /pads will be interpret as :revision
Router.route('/testplans/:chipName/pads', {
    name: 'padsList',
    data: function () {
        return Pads.find({chipName:this.params.chipName});
    }
});

// Test plan of chipName
Router.route('/testplans/:chipName/:revision', {
    name: 'testplanPage',
    data: function () {
        // make sure to convert the :revision to number because it's Number in schema
        return Testplans.findOne({chipName: this.params.chipName, revision:Number(this.params.revision)});
    }
});

// The test group of test plan of chipName
Router.route('/testplans/:chipName/:revision/tests/:name', { // use :name to denote the testgroupName because that's the attribute testgroup object has, this allow passing this into pathFor
    name: 'testgroup',
    data: function () {
        // This piece of code will cause problem because it depends on server return the testgroup object
        // var testgroup = Testgroups.findOne({chipName:this.params.chipName, name:this.params.name});
        // for now use :chipName and :name to locate TODO: figure out a way to wait for testgroup return
        return Testitems.find({ chipName:this.params.chipName, 
                                testgroupName:this.params.name, 
                                revision:Number(this.params.revision)});
    }
});

Router.onBeforeAction('dataNotFound', {only: 'testplanPage'});
