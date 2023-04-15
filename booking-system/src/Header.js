import './Header.css';
import { Heading } from '@chakra-ui/react'

import { Location } from './Location';

export default function Header (){
    
    return(
        <section id="header-section"> 
            <nav>
                <Heading as='h1' size='xl'>
                    Plan Your Next Movie Trip
                </Heading>
            </nav>
            <nav>
                {/* <Location /> */}
            </nav>
        </section>
    );
}