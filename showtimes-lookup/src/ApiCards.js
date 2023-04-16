import { Heading, Text, Input, Button } from '@chakra-ui/react';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import MyContext from './Context';

import { useContext } from 'react';

function ApiCards (props) {
    const [selectedPlace, setSelectedPlace] = useContext(MyContext);

    function switchToStats () {
        setSelectedPlace(true);
    }

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