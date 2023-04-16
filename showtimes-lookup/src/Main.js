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
  const [cityData, setCityData] = useState('');
  const [embeddedResults, setEmbeddedResults] = useState('');
  
  function handleChange(event){
      setText(event.target.value);
    }
    

  function handleSearch(){
    // axios.post('http://localhost/cities-lookup/retrieve.php', text, 
    axios.get(`https://api.teleport.org/api/cities/?search=${text}`, 
    {headers: {'Content-Type': 'application/json'}})
    
    .then(response => {
      setIsAnimated(true)
      setCityData(response.data)
      setEmbeddedResults(response.data._embedded["city:search-results"]);
    })
    // .then(response => )
    // .then()
    .catch(error => console.log(error));
    // .then(response => {
    //   console.log(response.data);
    // })

  }

  useEffect(() => {
    console.log(cityData);
    console.log(embeddedResults);

  }, [cityData])
  
  function capitalizeFirstLetter(str) {
    setText(str.charAt(0).toUpperCase() + str.slice(1));
  }

  function detectEnter(e){
    
    capitalizeFirstLetter(e.target.value);
    if (e.keyCode === 13) {
      handleSearch();
    }
  }

  return (
    <> 
      <Header />
      <section>
        <motion.div id='container-location'
          animate={{x: isAnimated && '25vw', y: isAnimated && '-15vh', width: isAnimated && '30%'}}
          transition={{duration: 0.75}}
        >
          <div id='location-comp'>   
            <Text size='lg'>Show me information for:</Text>
            <Input onChange={handleChange} onKeyDown={(e) => detectEnter(e)} value={text} size='md' htmlSize={20} width='auto' variant='flushed' placeholder='ZIP Code or City Name'></Input>  
            {/*  style={{textTransform: "uppercase"}} */}
            <Button onClick={handleSearch} variant='solid'>Search</Button>
          </div>        

        </motion.div>

        <div id='search-results'>
          <p>{embeddedResults.map(each => each.matching_full_name)}</p>
        </div>
      </section>
      <main>



      </main>
      
    </>
  );
}

export default Main;
