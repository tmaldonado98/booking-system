import { Text } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react';

import { useState } from 'react';
import './location.css';

export function Location (){
    const [text, setText] = useState('');

    function handleChange(event){
        setText(event.target.value);
    }

    function handleSearch(){
        setText('')
    }

    return (
        <div id='location-comp'>   
            <Text size='lg'>Where would you like to see a movie?</Text>
            <Input onChange={handleChange} value={text} size='md' htmlSize={20} width='auto' variant='flushed' placeholder='ZIP Code or City Name'></Input>  
            <Button onClick={handleSearch} variant='solid'>Search</Button>
        </div>        
    )
}

// export function BigButton () {
//     return (
//         <>
//             <Button hidden={!buttonSize}></Button>
//         </>
//     );
// }