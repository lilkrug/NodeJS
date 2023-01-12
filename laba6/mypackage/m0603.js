const sendmail = require('sendmail')();
const mymail = 'jihiyat399@ekbasia.com';

function send(message){
    sendmail({
        from:'jihiyat399@ekbasia.com',
        to:mymail,
        subject:'test sendmail',
        html:message
    }, function(err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
    })
}

module.exports = {send};