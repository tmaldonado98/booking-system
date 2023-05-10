import Header from "./Header";
import { useContext, useEffect, useRef, useState } from "react";
import MyContext from "./Context";
import { Heading } from "@chakra-ui/react";
import { Accordion, Spinner, Fade, 
    Modal, ModalHeader, ModalBody, ModalFooter, Input, Button 
} from "reactstrap";

import { Link, useLocation, useNavigate} from 'react-router-dom';
import {
    UncontrolledAccordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
  } from 'reactstrap';
import './lists.css';
import axios from "axios";
import {BsGearFill} from 'react-icons/bs';

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

    const [fade, setFade] = useState(null);
    // const fadeRef = useRef(fade);

    function handleGear (key){
        if (fade === null) {
            setFade(key)
        } else if (fade !== null){
            setFade(null)
        }
    }

    const [modalEditList, setModalEditList] = useState(false);
    const [edListName, setEdListName] = useState('');

    const toggleEditList = () => {
        setModalEditList(!modalEditList);
        setEdListName('');
    };
   
    function handleListName(event){
        setEdListName(event.target.value);

    }

    function editListName(){
        console.log('will send to php script to edit name in database');
        toggleEditList();
    }




    const [modalDeleteList, setModalDeleteList] = useState(false);
    const toggleDeleteList = () => {
        setModalDeleteList(!modalDeleteList);
    };

    function deleteList(){
        console.log('will send query to delete list from database');
        toggleDeleteList();
    }


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
                                <Button onClick={() => handleGear(listsItems.indexOf(each))}><BsGearFill/></Button>
                                    {fade === listsItems.indexOf(each) ?
                                    <div className="container-gear-buttons">
                                        <Button onClick={toggleEditList} color="primary" outline>Edit List Name</Button><Button onClick={toggleDeleteList} color="primary" outline>Delete List</Button>
                                    
                                    <Modal isOpen={modalEditList}>
                                        <ModalHeader style={{justifyContent:'center'}}>Change List Name</ModalHeader>
                                        <ModalBody>
                                            <p style={{textAlign:'center'}}>Your List Is Currently Named: <h4>{each.list_name}</h4></p>
                                            
                                            <Input
                                            placeholder={each.list_name}
                                            onChange={handleListName}
                                            >
                                            </Input>
                                        </ModalBody>
                                        <ModalFooter style={{justifyContent:"center"}}>
                                            <Button color="primary" outline onClick={editListName}  disabled={edListName.length > 0 ? false : true}>
                                            
                                                Set New Name
                                            </Button>
                                            <Button color="secondary" outline onClick={toggleEditList}>
                                                Cancel
                                            </Button>
                                        </ModalFooter>
                                    </Modal>


                                    <Modal isOpen={modalDeleteList}>
                                        <ModalHeader style={{justifyContent:'center'}}>Delete List</ModalHeader>
                                        <ModalBody>
                                            <p style={{textAlign:'center'}}>Are You Sure You Want To Delete Your List: <h4>{each.list_name}?</h4></p>
                                        </ModalBody>
                                        <ModalFooter style={{justifyContent:"center"}}>
                                            <Button color="danger" outline onClick={deleteList}>
                                            
                                                Delete List
                                            </Button>
                                            <Button color="secondary" outline onClick={toggleDeleteList}>
                                                Cancel
                                            </Button>
                                        </ModalFooter>
                                    </Modal>

                                    </div>

                                    :
                                    ''
                                    }
                                {<p>{each.place.map(item => (
                                    <p>{item.city +', ' + item.country}</p>
                                    )
                                    )}</p>}
                            </AccordionBody>
                            :

                            <AccordionBody accordionId={listsItems.indexOf(each)}>
                                <Button onClick={() => handleGear(listsItems.indexOf(each))}><BsGearFill/></Button>
                                    {fade === listsItems.indexOf(each) &&
                                    
                                    <div className="container-gear-buttons">
                                        <Button onClick={toggleEditList} color="primary" outline>Edit List Name</Button><Button onClick={toggleDeleteList} color="primary" outline>Delete List</Button>
                                    
                                    <Modal isOpen={modalEditList}>
                                        <ModalHeader style={{justifyContent:'center'}}>Change List Name</ModalHeader>
                                        <ModalBody>
                                            <p style={{textAlign:'center'}}>Your List Is Currently Named: <h4>{each.list_name}</h4></p>
                                            
                                            <Input
                                            placeholder={each.list_name}
                                            onChange={handleListName}
                                            >
                                            </Input>
                                        </ModalBody>
                                        <ModalFooter style={{justifyContent:"center"}}>
                                            <Button color="primary" outline onClick={editListName}  disabled={edListName.length > 0 ? false : true}>
                                            
                                                Set New Name
                                            </Button>
                                            <Button color="secondary" outline onClick={toggleEditList}>
                                                Cancel
                                            </Button>
                                        </ModalFooter>
                                    </Modal>


                                    <Modal isOpen={modalDeleteList}>
                                        <ModalHeader style={{justifyContent:'center'}}>Delete List</ModalHeader>
                                        <ModalBody>
                                            <p style={{textAlign:'center'}}>Are You Sure You Want To Delete Your List: <h4>{each.list_name}?</h4></p>
                                        </ModalBody>
                                        <ModalFooter style={{justifyContent:"center"}}>
                                            <Button color="danger" outline onClick={deleteList}>
                                            
                                                Delete List
                                            </Button>
                                            <Button color="secondary" outline onClick={toggleDeleteList}>
                                                Cancel
                                            </Button>
                                        </ModalFooter>
                                    </Modal>
                                    </div>
                                    }
                                <p>You have not added any places to this list!</p>
                                
                            </AccordionBody>
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