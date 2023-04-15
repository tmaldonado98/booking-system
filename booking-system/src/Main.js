import { useEffect, useState } from 'react';
import './Main.css';
import Header from './Header';
import { Location } from './Location';
import { Text, Input, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import axios from 'axios';

function Main() {
  const [isAnimated, setIsAnimated] = useState(false)
  const [text, setText] = useState('');
  const [zipObj, setZipObj] = useState('');
  
  function handleChange(event){
      setText(event.target.value);
    }
    
    useEffect(() => {
      setZipObj({zip: text})
      
  }, [text])

  function handleSearch(){
    axios.post('http://localhost/booking-system/retrieve.php', zipObj, 
    {headers: {'Content-Type': 'application/json'}})
    
    .then(setIsAnimated(true))
    .then(response => {
      console.log(response.data);
    })
    .then(setText(''))
    .catch(error => console.log(error));
  }

  return (
    <> 
      <Header />
      <section>
        <motion.div id='container-location'
          animate={{x: isAnimated && 350, y: isAnimated && -60, width: isAnimated && '30%'}}
        >
          <div id='location-comp'>   
            <Text size='lg'>Where would you like to see a movie?</Text>
            <Input onChange={handleChange} value={text} size='md' htmlSize={20} width='auto' variant='flushed' placeholder='ZIP Code or City Name'></Input>  
            <Button onClick={handleSearch} variant='solid'>Search</Button>
          </div>        

        </motion.div>
      </section>
      <main>



      </main>
      
    </>
  );
}

export default Main;
