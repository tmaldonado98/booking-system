import { useContext, useEffect, useState } from 'react';
import './Main.css';
import Header from './Header';
import ApiCards from './ApiCards';
import MyContext from './Context';
import Stats from './Stats';

import { Heading, Text, Input, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import axios from 'axios';

function Main() {
  const [isAnimated, setIsAnimated] = useState(false)
  const [text, setText] = useState('');
  const [cityData, setCityData] = useState('');
  const [embeddedResults, setEmbeddedResults] = useState('');
  const [stockData, setStockData] = useState(null);

  const { selectedPlace, setSelectedPlace ,  selectedGeo, setSelectedGeo , mapCreated, setMapCreated, currentAccount, setCurrentAccount, listsItems, setListsItems} = useContext(MyContext);
  
  useEffect(() => {
    // console.log(listsItems);
    console.log(currentAccount)
  }, [])

  useEffect(() => {
    document.getElementById('focus').focus();

      axios.get(`https://api.teleport.org/api/cities/?search=${text}`,
      {headers: {'Content-Type': 'application/json'}})
      .then(response => {
        setStockData(response.data._embedded["city:search-results"])
      })
      .catch(error => console.log(error));
  }, [])

    // useEffect(() => {
    //   // console.log(stockData);
    // }, [stockData])

    function handleChange(event){
      setText(event.target.value);
      setSelectedPlace(false);
    }    

  function handleSearch(){
    if(text.length > 0){
      axios.get(`https://api.teleport.org/api/cities/?search=${text}`, 
      {headers: {'Content-Type': 'application/json'}})
      
      .then(response => {
        setIsAnimated(true)
        setCityData(response.data)
        setEmbeddedResults(response.data._embedded["city:search-results"]);
      })
      .catch(error => console.log(error));
    } else {
      document.getElementById('focus').focus();
      return false;
    }

  }

  function capitalizeFirstLetter(str) {
    const words = str.split(" ");

    const capitalizedWords = words.map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    );

  // Join the capitalized words back into a string
  setText(capitalizedWords.join(" "));
  }


  function detectEnter(e){  
    capitalizeFirstLetter(e.target.value);
    if (e.keyCode === 13) {
      handleSearch();
    }
  }

  // useEffect(() => {
  //   // console.log(selectedGeo)
  // }, [selectedGeo])


  return (
    <> 
      <Header />

      <>
        <div id='container-location'
          animate={{x: isAnimated && '25vw', y: isAnimated && '-15vh', width: isAnimated && '30%'}}
          transition={{duration: 0.75}}
        >
          <div id='location-comp'>   
            <Heading style={{textAlign:'center'}} size='sm'>                    
              Ever wondered what it would be like to live in other cities? <br/>
              Look no further! Type in the name of a city and CityLookup will show you...
            </Heading>
            <Input id='focus' onChange={handleChange} onKeyDown={(e) => detectEnter(e)} value={text} size='md' htmlSize={20} width='auto' variant='flushed' placeholder='e.g. Los Angeles, United States'></Input>  

            <Button onClick={handleSearch} variant='solid'>Search</Button>
            <Button variant='solid' onClick={() => setSelectedGeo('')}>
              Remove Selected Place
            </Button>
            {currentAccount === null &&
              <Text style={{textAlign:'center', padding:'18px', margin:'0'}} size='sm'>
                  Create lists of your favorite places! <br/>
                  Create an account and sign in! <br/>
                  Alternatively, you can use our <strong>demo account</strong>.
              </Text>
            
                }
          </div>    

        </div>

        {selectedPlace === false ?
        <div id='search-results'>
          {/* {console.log(embeddedResults)} */}
          {embeddedResults && embeddedResults.map(each => <ApiCards cardData={each.matching_full_name} fullData={each}/>)}
        </div>
        :
        ''
        }


          {selectedGeo !== '' ? 
            <div id='selected-place'>
              <Stats data={selectedGeo} />
            </div>
          :
            <div id='selected-place' style={{display: 'none'}}></div>
          }
      </>

      <section id='stock-container'>
        <Heading as='h2' size='md' id='stock-header'>Major Cities Around The World</Heading>
        <div id='stock-data'>
          {stockData ? stockData.map(each => <ApiCards dataStock={stockData} cardData={each.matching_full_name} fullData={each}/>) : ''}
        </div>
      </section>

      
    </>
  );
}

export default Main;
