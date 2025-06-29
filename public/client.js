document.addEventListener('DOMContentLoaded', () => {
    const timeDisplayElement = document.getElementById('timeDisplay');
    const connectionStatusElement = document.getElementById('connectionStatus');

   
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws/time`; 

    let ws; 
    function connectWebSocket() {
        ws = new WebSocket(wsUrl);

        
        ws.onopen = () => {
            console.log('WebSocket connected!');
            connectionStatusElement.textContent = 'WebSocket Status: Connected';
            connectionStatusElement.style.color = '#27ae60'; 
            timeDisplayElement.textContent = 'Fetching time...'; 
        };

        
        ws.onmessage = event => {
            try {
                
                const data = JSON.parse(event.data);
                if (data.type === 'timeUpdate' && data.time) {
                    timeDisplayElement.textContent = data.time;
                }
            } catch (e) {
                console.error('Failed to parse message or invalid message format:', event.data, e);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected. Attempting to reconnect in 3 seconds...');
            connectionStatusElement.textContent = 'WebSocket Status: Disconnected (Reconnecting...)';
            connectionStatusElement.style.color = '#e74c3c'; 
            timeDisplayElement.textContent = 'Lost connection.';
            setTimeout(connectWebSocket, 3000);
        };

        
        ws.onerror = error => {
            console.error('WebSocket error:', error);
            connectionStatusElement.textContent = 'WebSocket Status: Error!';
            connectionStatusElement.style.color = '#f39c12';
            ws.close();
        };
    }
    connectWebSocket();
});