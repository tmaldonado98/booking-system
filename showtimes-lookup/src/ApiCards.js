import { Heading, Text, Input, Button } from '@chakra-ui/react';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import MyContext from './Context';

import { useContext, useState, useEffect } from 'react';
import axios from 'axios';

function ApiCards (props) {
    // const [selectedPlace, setSelectedPlace] = useContext(MyContext);
    // const [placeData, setPlaceData] = useContext(MyContext);
    // const [selectedGeo, setSelectedGeo] = useContext(MyContext)
    const { selectedPlace, setSelectedPlace ,  selectedGeo, setSelectedGeo, mapCreated, setMapCreated} = useContext(MyContext);

    function switchToStats () {
        axios.get(`${props.fullData._links['city:item'].href}`,
        {headers: {'Content-Type': 'application/json'}})
        .then(response => {
            setSelectedGeo(response.data)
            // console.log(response.data)
        })
        .then(setSelectedPlace(true))
        .then(setMapCreated(false))
        .catch(error => console.log(error));
    }

    useEffect(() => {
        console.log(selectedGeo)
    }, [selectedGeo])

    return (
        <>
            <Card width='250px'>
                <CardHeader>
                    <Heading size='md'>{props.cardData}</Heading>
                </CardHeader>
                <CardFooter>
                <Button onClick={switchToStats}>Select</Button>
                </CardFooter>
            </Card>
        </>
    );
}

export default ApiCards;