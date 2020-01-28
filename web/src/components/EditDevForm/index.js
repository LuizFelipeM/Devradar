import React, { useState } from 'react';

export default function EditDevForm({ dev, onSubmit }){
    const [techs, setTechs] = useState(dev.techs.join(', '));
    const [latitude, setLatitude] = useState(dev.location.coordinates[1]);
    const [longitude, setLongitude] = useState(dev.location.coordinates[0]);

    async function handleSubmit(e){
        e.preventDefault();

        await onSubmit({
            techs,
            latitude,
            longitude
        })
    }

    return(
        <form onSubmit={handleSubmit}>

            <div className="input-block">
                <label htmlFor="techs">Técnologias</label>
                <input
                    id="techs"
                    name="techs"
                    value={techs}
                    onChange={ e => setTechs(e.target.value) }
                    required
                />
            </div>

            <div className="input-group">
                <div className="input-block">
                    <label htmlFor="latitude">Latitude</label>
                    <input
                    id="latitude"
                    type="number"
                    name="latitude"
                    value={latitude}
                    onChange={ e => setLatitude(e.target.value) }
                    required
                    />
                </div>

                <div className="input-block">
                    <label htmlFor="longitude">Longitude</label>
                    <input
                    id="longitude"
                    type="number"
                    name="longitude"
                    value={longitude} 
                    onChange={ e => setLongitude(e.target.value) }
                    required
                    />
                </div>
            </div>

            <button type="submit">Salvar</button>

        </form>
    )
}