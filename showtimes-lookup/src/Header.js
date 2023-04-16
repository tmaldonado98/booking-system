import './Header.css';
import { Heading } from '@chakra-ui/react'

import { Location } from './Location';

export default function Header (){
    
    return(
        <section id="header-section"> 
            <nav>
                <Heading as='h1' size='xl'>
                    Life In Other Cities
                </Heading>
                <Heading as='h2' size='md'>
                    Ever wondered what it would be like to live in other cities? <br/>
                    Look no further! Type in the name of a city and we will show you...
                </Heading>
            </nav>
            <nav>
                {/* <Location /> */}
            </nav>
        </section>
    );
}