import React from 'react';
import './styles.css';

export default function DevDetail({ dev }){
    const { github_username, name, avatar_url, bio,  techs, location } = dev;
    const latitude = location.coordinates[1].toFixed(6);
    const longitude = location.coordinates[0].toFixed(6);

    return (
        <div className="dev">
            <header>
                <a href="/" className="back btn">&lt; Voltar</a>
            </header>
            
            <div className="body">
                <img className="avatar" src={avatar_url} alt={name} />

                <div className="information">
                    <strong className="name">{name}</strong>
                    <span className="techs">{techs.join(', ')}</span>
                    <span className="location">{latitude}, {longitude}</span>

                    <p className="bio">{bio}</p>
                    
                    <a href={`https://github.com/${github_username}`} target="_blank" rel="noopener noreferrer">Acessar perfil no Github</a>
                </div>
            </div>
        </div>
    )
}