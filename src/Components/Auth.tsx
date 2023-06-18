import React, { useContext } from 'react'
import ZkClientContext from '../Context/ZkClient';


export const Auth = () => {

    const { zkClient, login } = useContext(ZkClientContext);
    return <div>
        {!zkClient && <button onClick={login}>login</button>}
    </div>
}