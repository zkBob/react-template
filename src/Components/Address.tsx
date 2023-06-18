import React from "react";
import { useContext, useState } from "react";
import ZkClientContext from "../Context/ZkClient";
export const Address = () => {

    const { zkClient } = useContext(ZkClientContext);

    const [address, setAddress] = useState<string | undefined>(undefined);

    const genAddress = async (event: any) => {
        const _address = await zkClient?.generateAddress();
        console.log("address: ", _address);
        setAddress(_address);

    }
    return <div>
        {
            zkClient && <div>
                <button onClick={genAddress}>Generate Address</button>
                <p>{address}</p>
            </div>
        }
    </div>

}