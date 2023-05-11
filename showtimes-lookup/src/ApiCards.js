import { Heading, Text, Input, Button } from '@chakra-ui/react';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import MyContext from './Context';

import { useContext, useState, useEffect } from 'react';
import axios from 'axios';

function ApiCards (props) {
    // const [selectedPlace, setSelectedPlace] = useContext(MyContext);
    // const [placeData, setPlaceData] = useContext(MyContext);
    // const [selectedGeo, setSelectedGeo] = useContext(MyContext)
    const [imgData, setImgData] = useState(null);
    const [slugForImg, setSlugForImg] = useState(null);
    const [imgUrl, setImgUrl] = useState(null);
    
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
        window.scrollTo({
            top: 350,
            behavior: "smooth"
          });
    }


    // get slug, then get href from slug parameter

    useEffect(() => {
        // console.log(props.fullData)
        axios.get(`${props.fullData._links['city:item'].href}`,
        {headers: {'Content-Type': 'application/json'}})
        .then(response => {
            setImgData(response.data)
            // console.log(response.data)
        })

    }, [])
    
    useEffect(() => {
        if (imgData !== null) {
            if (imgData._links['city:urban_area']) {
            // console.log(imgData)
                
                axios.get(`${imgData._links['city:urban_area']['href']}`,
                {headers: {'Content-Type': 'application/json'}})
                .then(response => {
                    setSlugForImg(response.data)
                    // console.log(response.data)
                })
            } else {
                setSlugForImg(null)
            }
            
        }

    }, [imgData])

    useEffect(() => {
        if (slugForImg !== null) {
            axios.get(`${slugForImg._links['ua:images']['href']}`,
            {headers: {'Content-Type': 'application/json'}})
            .then(response => {
                setImgUrl(response.data)
            });

        } else {
            setImgUrl(null);
        }
    }, [slugForImg])

    return (
        <>
            <Card width='250px'>
                <CardHeader>
                    <Heading size='md'>{imgData !== null && imgData.name + ', ' + imgData._links['city:country']['name']}</Heading>
                </CardHeader>
                <CardBody>
                    <div id='img-container'>
                        {imgUrl !== null &&
                            <img src={imgUrl.photos[0].image.web} />
                        }
                    </div>
                </CardBody>
                <CardFooter style={{justifyContent:'center'}}>
                    <Button onClick={switchToStats}>Select</Button>
                </CardFooter>
            </Card>
        </>
    );
}

export default ApiCards;