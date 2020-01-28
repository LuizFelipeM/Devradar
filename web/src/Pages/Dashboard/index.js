import React, { useState, useEffect } from 'react';
import api from '../../services/api';

import DevForm from '../../components/DevForm';
import DevItem from '../../components/DevItem';

import './Sidebar.css';
import './Main.css';

function Dashboard() {
  const [devs, setDevs] = useState([]);

  useEffect(()=>{
    async function loadDevs(){
      const res = await api.get('/devs');

      setDevs(res.data);
    }

    loadDevs();
  }, [])

  async function handleAddDev(data){
    const res = await api.post('/devs', data)

    setDevs([...devs, res.data]);
  }

  function handleRemove(headers){
    api.delete('/devs', { headers });
    const index = devs.findIndex(dev => dev.github_username === headers.github_username);
    devs.splice(index, 1);
    
    setDevs([...devs]);
  }

  return(<>
    <aside>
      <strong>Cadastrar</strong>

      <DevForm onSubmit={handleAddDev} />
    </aside>

    <main>
      <ul>
        
        {devs.map(dev => (
          <DevItem key={dev._id} dev={dev} onRemove={handleRemove} />
        ))}

      </ul>
    </main>
  </>);
}

export default Dashboard;
