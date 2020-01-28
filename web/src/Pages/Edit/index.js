import React, { useState, useEffect } from 'react';
import api from '../../services/api';

import DevDatail from '../../components/DevDetail';
import EditDevForm from '../../components/EditDevForm'

import './styles.css'

export default function Edit({ history }){
    const [dev, setDev] = useState({});
    const devUrl = history.location.pathname.replace('edit', 'devs');

    useEffect(() => {
        async function searchDev(){
            const res = await api.get(devUrl);

            setDev(res.data);
        }

        searchDev();
    }, [])

    async function handleSubmit(data){
        const res = await api.patch(devUrl, data);

        setDev(res.data);
    }

    if(Object.entries(dev).length === 0 && dev.constructor === Object)
        return null;
    else
        return(<>
            <aside>
                <strong>Editar informações</strong>
                <EditDevForm dev={dev} onSubmit={handleSubmit} />
            </aside>
            
            <main>
                <DevDatail dev={dev} />
            </main>
        </>)
}