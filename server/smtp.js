Meteor.startup(function () {
    smtp = {
        username: 'lionel_lei@yahoo.com',   // eg: server@gentlenode.com
        password: 'nKZa7Aj65K6bwzPUy7b_uQ',   // eg: 3eeP1gtizk5eziohfervU
        server:   'smtp.mandrillapp.com',  // eg: mail.gandi.net
        port: 587
    };

    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});