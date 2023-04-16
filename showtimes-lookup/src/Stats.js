import { Heading, Text, Input, Button } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

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
          }
    }, [slug])

    return (
        <>
            <div className="chart">
                <Heading as='h4'>{props.data.full_name}</Heading>
                {/* <h4>Population: {(props.data.population).toLocaleString('us')}</h4> */}

                {scores !== null &&
                    
                        scores['categories'].map(each => {
                            return <p>{each.name}, {each.score_out_of_10}</p>
                        })
                        
                    
                }
                <div className="bar"></div>
                {/* <!-- Change the value below --> */}
                <span id="value1">68</span>
            </div>
        </>
    );
}