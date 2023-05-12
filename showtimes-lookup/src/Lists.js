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
import {IoMdRemove} from 'react-icons/io';

function Lists () {

    const {currentAccount, setCurrentAccount, listsItems, setListsItems} = useContext(MyContext);    

    function loadListNames(){
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

    };

    useEffect(() => {
        loadListNames();
    }, [])

    // useEffect(() => {
    //     loadListNames();
    // }, [listsItems])

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

    function editListName(currentListName, listIndex){
        // console.log('will send to php script to edit name in database');
        axios.post('http://localhost/backend-cities-lookup/editListName.php', {updatedListName: edListName, toList: currentListName, userEmail: currentAccount.email, index: listIndex},
        {headers: {'Content-Type': 'application/json'}})
        .then(response => {
            console.log(response);
            loadListNames();
            toggleEditList();
            handleGear(listIndex);
        })

        .catch(error => console.log(error));
    }




    const [modalDeleteList, setModalDeleteList] = useState(false);
    const toggleDeleteList = () => {
        setModalDeleteList(!modalDeleteList);
    };

    function deleteList(listIndex){
        axios.post('http://localhost/backend-cities-lookup/deleteList.php', {index: listIndex, userEmail: currentAccount.email},
        {headers: {'Content-Type': 'application/json'}})
        .then(response => {
            console.log(response);
            loadListNames();
            toggleDeleteList();
            handleGear(listIndex);
        })

        .catch(error => console.log(error));

    }

    const [modalDeleteItem, setModalDeleteItem] = useState('');
    const toggleDeleteItem = (listIndex, itemIndex) => {
        setModalDeleteItem(listIndex + itemIndex);
        console.log(listIndex + itemIndex);
    };
    

    function deleteListItem(listIndex, listItemIndex){
        // console.log('will send axios post to php script to delete this object from place array for this specific list.')
        axios.post('http://localhost/backend-cities-lookup/deleteItem.php', {listIndex: listIndex, listItemIndex: listItemIndex, userEmail: currentAccount.email},
        {headers: {'Content-Type': 'application/json'}})
        .then(response => {
            console.log(response.data);
            loadListNames();
            setModalDeleteItem('');
            handleGear(listIndex);
        })

        .catch(error => console.log(error));

        
        
        // console.log(city, country, list);
        setModalDeleteItem('');
    }


    function detectEnter(e, currentListName, listIndex){  
        if (e.keyCode === 13) {
            console.log('should work');
            editListName(currentListName, listIndex);
        } else {
            console.log('not working');
            return false;
        }
      }


    return (
        <section id='lists-section'>
        {currentAccount && 
        <>
            <Header />
            <Heading style={{textAlign:'center'}}>
                {currentAccount.name + "'s Lists"}
            </Heading>
            {currentAccount.email === 'demo@gmail.com' &&
                <h3 style={{textAlign:'center', margin:'20px auto'}}>
                Please create, modify, and/or delete any list! <br/>
                Please play around with the app as you wish!
            </h3>}
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
                            {each.place &&
                            <AccordionBody accordionId={listsItems.indexOf(each)}>
                                <div style={{display:'flex', justifyContent:'start'}}>
                                    <Button outline color="dark" onClick={() => handleGear(listsItems.indexOf(each))}><BsGearFill/></Button>
                                </div>
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
                                            <Button color="primary" outline onClick={() => editListName(each.list_name, listsItems.indexOf(each))} onKeyDown={(e) => detectEnter(e, each.list_name, listsItems.indexOf(each))}  disabled={edListName.length > 0 ? false : true}>
                                            
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
                                            <Button color="danger" outline onClick={() => deleteList(listsItems.indexOf(each))}>
                                            
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
                                {each.place.length > 0 &&
                                    <ul>{each.place.map(item => (
                                    <>
                                    <li><strong>{item.city +', ' + item.country}</strong><Button style={{borderRadius:'30px'}} onClick={() => toggleDeleteItem(JSON.stringify(listsItems.indexOf(each)), JSON.stringify(each.place.indexOf(item)))} outline color="danger" size="sm" ><IoMdRemove/></Button></li>
                                                                       
                                    <Modal isOpen={modalDeleteItem === JSON.stringify(listsItems.indexOf(each)) + JSON.stringify(each.place.indexOf(item)) ? true : false}>
                                        <ModalHeader style={{justifyContent:'center'}}>Delete <strong>{item.city + ', ' + item.country}</strong>?</ModalHeader>
                                        <ModalBody>
                                            <p style={{textAlign:'center'}}>Are You Sure You Want To Delete <strong>{item.city + ', ' + item.country}</strong> From {each.list_name}?</p>
                                        </ModalBody>
                                        <ModalFooter style={{justifyContent:"center"}}>
                                            <Button color="danger" outline onClick={() => deleteListItem(listsItems.indexOf(each), each.place.indexOf(item))}>
                                            
                                                Delete Item
                                            </Button>
                                            <Button color="secondary" outline onClick={() => setModalDeleteItem('')}>
                                                Cancel
                                            </Button>
                                        </ModalFooter>
                                    </Modal>
                                    </>)
                                    )}</ul>
                                    
                                    }

                                {each.place.length === 0 &&
                                    <p>You have not added any places to this list!</p>
                                }
                                    
                            </AccordionBody>
                            }

                            {/* {each.place === undefined &&
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
                                            <Button color="primary" outline onClick={() => editListName(each.list_name)}  disabled={edListName.length > 0 ? false : true}>
                                            
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
                                            <Button color="danger" outline onClick={() => deleteList(listsItems.indexOf(each))}>
                                            
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
                            } */}

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