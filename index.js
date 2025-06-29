let express = require('express');
let app = express();

let expressWs = require('express-ws')(app);

app.use(express.static('public'));

app.use(function (req, res, next) {
    console.log('Server is Online');
    req.testing = 'testing'; 
    return next();
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
    
});


function getCurrenHazaribagTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
}

app.ws('/ws/time', function(ws, req) {
    console.log('Client connected to WebSocket for time updates!');
    console.log('Socket context test:', req.testing); 
    ws.send(JSON.stringify({ type: 'timeUpdate', time: getCurrenHazaribagTime() }));

    
    const interval = setInterval(() => {
        const timeData = {
            type: 'timeUpdate',
            time: getCurrenHazaribagTime()
        };
        
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify(timeData));
        }
    }, 1000);

    
    ws.on('message', function(msg) {
        console.log('Received message from client:', msg.toString());
    });

    
    ws.on('close', function() {
        console.log('Client disconnected from WebSocket.');
        clearInterval(interval);
    });

    ws.on('error', function(error) {
        console.error('WebSocket error:', error);
    });
});

app.listen(6969, "192.168.1.13", function() {
    console.log('Server started on http://192.168.1.13:6969');
    console.log('WebSocket endpoint for time: ws://192.168.1.13:6969/ws/time');
});