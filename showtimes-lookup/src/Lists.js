import Header from "./Header";
import { useContext, useEffect, useState } from "react";
import MyContext from "./Context";
import { Heading, Button } from "@chakra-ui/react";
import { Accordion, Spinner, Fade } from "reactstrap";
// import {} from chakra;
import { Link, useLocation, useNavigate} from 'react-router-dom';
import {
    UncontrolledAccordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
  } from 'reactstrap';
import './lists.css';
import axios from "axios";


function Lists () {

    const {currentAccount, setCurrentAccount, listsItems, setListsItems} = useContext(MyContext);    

    useEffect(() => {
        if (!currentAccount) {
            // setShowUnauth();
            return false;
        } else if (currentAccount){
            axios.post('http://localhost/backend-cities-lookup/retrieveLists.php', {email: currentAccount.email},
            {headers: {'Content-Type': 'application/json'}})
            .then(response => {
                console.log(JSON.parse(response.data.list_array));
                setListsItems(JSON.parse(response.data.list_array));
            })
            console.log(currentAccount)
        }
    }, [])

    const [fade, setFade] = useState(false);

    return (
        <section id='lists-section'>
        {currentAccount && 
        <>
            <Header />
            <Heading>
                {currentAccount.name + "'s Lists"}
            </Heading>
        </>
        }
        
        {!currentAccount &&
        <>
            <Header />
            <Heading>
                You Are Not Signed In!
            </Heading>
            <h4>
                Sign in to create your own custom lists!
            </h4>
            <h4>
                Head to the home page to browse without signing in
            </h4>
            <Link to='/'>
                <Button>Home</Button>
            </Link>

        </>
        }

        <div id="lists-container">
            {listsItems === false || listsItems.length === 0 &&
                <p> 
                    You have not created any lists yet  :(
                </p>
            }
            {listsItems === null &&
                <p>
                    Loading...  <Spinner color="primary" size="sm" />
                </p>
            }
            {listsItems !== null && listsItems !== false &&
            <UncontrolledAccordion stayOpen>
                
                {listsItems.map(obj => obj.place) &&
                    listsItems.map(each => (
                        <AccordionItem>
                            <AccordionHeader targetId={listsItems.indexOf(each)}><h4>{each.list_name}</h4></AccordionHeader>
                            {each.place ?
                            <AccordionBody accordionId={listsItems.indexOf(each)}>
                                <Button onClick={function noRefCheck(){setFade(prevState => !prevState)}}>Edit Name</Button>
                                <Fade
                                    className="mt-3"
                                    in={fade}
                                    tag="h5"
                                >
                                    This content will fade in and out as the button is pressed
                                </Fade>
                                {<p>{each.place.map(item => (
                                    <p>{item.city +', ' + item.country}</p>
                                    )
                                    )}</p>}
                            </AccordionBody>
                            :
                            <AccordionBody accordionId={listsItems.indexOf(each)}><p>You have not added any places to this list!</p></AccordionBody>
                            }
                        </AccordionItem>
                    ))
                }   
            </UncontrolledAccordion>
            }
        </div>

        </section>
    )
}

export default Lists;