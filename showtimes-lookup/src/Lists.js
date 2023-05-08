import Header from "./Header";
import { useContext, useEffect, useState } from "react";
import MyContext from "./Context";
import { Heading } from "@chakra-ui/react";
import { Accordion, Button, Spinner } from "reactstrap";
import { Link, useLocation, useNavigate} from 'react-router-dom';
import {
    UncontrolledAccordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
  } from 'reactstrap';


function Lists () {

    const {currentAccount, setCurrentAccount, listsItems, setListsItems} = useContext(MyContext);    

    // const [activeAccordionId, setActiveAccordionId] = useState(null);

    // const handleAccordionToggle = (accordionId) => {
    //   setActiveAccordionId(activeAccordionId === accordionId ? null : accordionId);
    // };

    // useEffect(() => {
    //     for (let i = 0; i < lists.length; i++) {
    //         const element = array[i];
            
    //     }
    //     console.log(listsItems[i][each])
    // }, [listsItems])



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
                Head to the home page to browse without signing in
            </h4>
            <h4>
                Sign in to create your own custom lists!
            </h4>
            <Link to='/'>
                <Button>Home</Button>
            </Link>

        </>
        }

        <div id="lists-container">
        {/* Object.keys(listsItems).length === 00 */}
            {listsItems === false &&
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
            <UncontrolledAccordion>
                {/*  style={{display:'flex', justifyContent:'space-between', alignItems:'center'}} */}
                {
                    Object.keys(listsItems).map(each => (
                        <AccordionItem>
                            <AccordionHeader targetId='1'><h4>{each}</h4></AccordionHeader>
                            <AccordionBody accordionId="1">
                                {/* <p>{each.city}</p> */}
                                {<p>{listsItems[each].city}</p>}
                                
                                {/* <p>{Object.values(listsItems.country)}</p> */}
                                
                                {/* .map(item => item) */}
                            </AccordionBody>
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