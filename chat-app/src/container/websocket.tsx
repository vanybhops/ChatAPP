const websocket = new WebSocket(`${window.location.protocol==="http:"?"ws://"+window.location.host:"ws://"+window.location.host}`)
export default websocket