import React from 'react';
import './styles.css';

function DevItem({ dev, onRemove }){
    const { _id, github_username, bio, avatar_url, name, techs } = dev;

    async function handleRemove(){ await onRemove({ github_username: github_username }); }

    return(
        <li className="dev-item" id={github_username}>
            <header>
                <img src={avatar_url} alt={name}/>
                <div className="user-info">
                    <strong>{name}</strong>
                    <span>{techs.join(', ')}</span>
                </div>

                <button onClick={handleRemove} className="remove">&times;</button>
            </header>
            
            <p>{bio}</p>

            <footer>
                <a href={`https://github.com/${github_username}`} target='_blank' rel="noopener noreferrer">Acessar perfil no Github</a>

                <a href={`/edit/${_id}`}>Editar</a>
            </footer>
        </li>
    )
}

export default DevItem;