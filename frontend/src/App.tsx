import { useEffect, useState } from 'react'
// import './App.css'
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [msg, setMsg] = useState<any>([])
  const [data, setData] = useState<any>('')
  const [isConnected, setIsConnected] = useState(socket.connected);

  function sendMsg(){
    socket.emit('send_chat', {id: `${Math.random()}`, msg: data})
    setData('')
  }


  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('get_chat', (data) => {
      setMsg((prev: any) => [...prev, data])
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('get_chat');
    };
  }, [])
  
  // console.log(msg)

  return (
    <>
      {isConnected ? 'connected': 'not connect'}
      <div>
        {msg.map((el: any,i: number) => <div key={i}>{el.msg}</div>)}
      </div>
      <div>
        <input type="text" value={data} onChange={({target}) => setData(target.value)} />
        <button onClick={sendMsg}>send</button>
      </div>
    </>
  )
}

export default App
