import { Heading, Text, Input, Button } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

import './stats.css';

export default function Stats(props) {
    const [slug, setSlug] = useState(null);
    const [scores, setScores] = useState(null);
    const [show, setShow] = useState(false);
    // console.log(props.data['_links']['city:urban_area']['href'])

    function setScoreFromSlug(){
        console.log(slug)
        axios.get(`${slug._links['ua:scores'].href}`,
        {headers: {'Content-Type': 'application/json'}})
        .then(response => {
            setScores(response.data)
        })
    }

    useEffect(() => {
        axios.get(`${props.data['_links']['city:urban_area']['href']}`,
        {headers: {'Content-Type': 'application/json'}})
        .then(response => {
            setSlug(response.data)
            // console.log(response.data)
        })
        // .then(setScoreFromSlug)
        .catch(error => console.log(error))

    }, [])

    useEffect(() => {
        if (slug !== null) {
            setScoreFromSlug();
            increase();
          }
    }, [slug])

//// bars animation JS
function increase() {
    // Change the variable to modify the speed of the number increasing from 0 to (ms)
    let SPEED = 40;
    // Retrieve the percentage value
    let limit = parseInt(document.getElementsByTagName("span").innerHTML, 10);

    for(let i = 0; i <= limit; i++) {
        setTimeout(function () {
           document.getElementsByClassName("number").innerHTML = i + "%";
        }, SPEED * i);
    }
}



    return (
        <>
            <div className="chart">
                <Heading as='h4'>{props.data.full_name}</Heading>
                {/* <h4>Population: {(props.data.population).toLocaleString('us')}</h4> */}

                {scores !== null &&
                        scores['categories'].map(each => {
                            // {console.log(Object.keys(document.getElementsByClassName("number")))}                
                            // {increase()}
                            return (
                            <div>
                                <p>{each.name}, </p>
                                    <div style={{anim}} className="bar"></div>
                                    {/* <!-- Change the value below --> */}
                                    <span className='number'>{(Number(each.score_out_of_10) * 10).toFixed(1)}%</span>
                            </div>
                            )
                        })
                        
                    
                }
            </div>
        </>
    );
}