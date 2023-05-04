import {useLocation, useNavigate, BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Main from './Main';
import Lists from './Lists';
import MyContext from './Context';
import { useEffect, useState } from 'react';

export default function App() {

    const [currentAccount, setCurrentAccount] = useState(null); ///change later to useCOntext
    const [selectedPlace, setSelectedPlace] = useState(false);
    const [selectedGeo, setSelectedGeo] = useState('');
    const [mapCreated, setMapCreated] = useState(false); //context


return(
    <MyContext.Provider value={{selectedPlace, setSelectedPlace,  selectedGeo, setSelectedGeo, currentAccount, setCurrentAccount, mapCreated, setMapCreated}}>
        <Router>
            <Routes>
                <Route exact path='/' element={<Main />}/>
                <Route path='/Lists' element={<Lists />}/>
            </Routes>
        </Router>
    </MyContext.Provider>

)
}