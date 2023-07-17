import './App.css';
import {
  ZkBobClient, 
  TxType} from 'zkbob-client-js';
import { ZkClientProvider } from './Context/ZkClient';
import { Auth } from './Components/Auth';
import { ShieldedAddressGenerator } from './Components/ShieldedAddressGenerator';

function App() {

  return (
    <div className="App">
      <ZkClientProvider>
        <Auth/>
        <ShieldedAddressGenerator/>
      </ZkClientProvider>

    </div>
  );
}

export default App;
