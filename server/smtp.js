// TODO: Figure out why email won't send when deployed on cloud9's development server
// Sending email works when deploy to meteor's free test server, but won't work on cloud9's preview server.
Meteor.startup(function () {
    smtp = {
        username: 'lionel_lei@yahoo.com',   // eg: server@gentlenode.com
        password: 'nKZa7Aj65K6bwzPUy7b_uQ',   // eg: 3eeP1gtizk5eziohfervU
        server:   'smtp.mandrillapp.com',  // eg: mail.gandi.net
        port: 587
    };

    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});