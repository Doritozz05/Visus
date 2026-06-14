const figlet = require('figlet');

figlet('VISUS', {
    font: 'ANSI Shadow', // Trying 'ANSI Shadow' for a solid look
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 100,
    whitespaceBreak: true
}, function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log('\x1b[37m%s\x1b[0m', data); // \x1b[37m sets color to white
});
