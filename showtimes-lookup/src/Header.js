import './Header.css';
import { Heading } from '@chakra-ui/react'
import { Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

export default function Header (){
    ///Modal state
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    ///

    const [cSelected, setCSelected] = useState([]);
    const [rSelected, setRSelected] = useState(1);
  
    const onCheckboxBtnClick = (selected) => {
      const index = cSelected.indexOf(selected);
      if (index < 0) {
        cSelected.push(selected);
      } else {
        cSelected.splice(index, 1);
      }
      setCSelected([...cSelected]);
    };

    const [modalOption, setModalOption] = useState(true);

    function handleSignIn(){
        // axios.post
        toggle();
    }

    function handleRegistration(){
        // axios.post
        toggle();
    }

    ///email form
    const [value, setValue] = useState('');
    const [valid, setValid] = useState(null);
    const [invalid, setInvalid] = useState(null);
  
    //email regex
    const emailRegex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

    const handleEmail = (event) => {
      const inputValue = event.target.value;
      const inputType = event.target.type;
  
      // Check if the input value matches the input type
    //   const isValidInput = inputValue.match(new RegExp(inputType, 'i'));
        if (emailRegex.test(inputValue)) {
            setValid(true);
            setInvalid(false);
        } else {
            setInvalid(true);
            setValid(false);
        }

      setValue(inputValue);
    };


    return(
    <>
        <div id='nav'>          
            <div id='nav-buttons'>
                <Button onClick={toggle}>Log In/Sign Up</Button>
            </div>
        </div>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>
                    <ButtonGroup>
                        <Button
                        color="dark"
                        // outline
                        onClick={() => setRSelected(1)}
                        active={rSelected === 1}
                        >
                        Log In
                        </Button>
                        <Button
                        color="dark"
                        // outline
                        onClick={() => setRSelected(2)}
                        active={rSelected === 2}
                        >
                            Sign Up
                        </Button>
                    </ButtonGroup>
                </ModalHeader>
                {rSelected === 1 &&
                <ModalBody>
                    <h4>Email Address</h4>
                  <Input
                    bsSize="lg"
                    type="email"
                    value={value}
                    onChange={handleEmail}
                    valid={valid}
                    invalid={invalid}
                    />
                    
                    <h4>Password</h4>
                    <Input
                        bsSize="lg"
                        type="password"
                    />
                </ModalBody>
                }
                {rSelected === 2 &&
                <ModalBody>
                    <h4>Register Your Email Address</h4>
                  <Input
                    bsSize="lg"
                    type="email"
                    value={value}
                    onChange={handleEmail}
                    valid={valid}
                    invalid={invalid}
                    />
                    
                    <h4>Create A Password</h4>
                    <Input
                        bsSize="lg"
                        type="password"
                    />
                    <h4>Confirm Your Password</h4>
                    <Input
                        bsSize="lg"
                        type="password"
                    />
                </ModalBody>
                }
                <ModalFooter style={{justifyContent: 'center'}}>
                    {rSelected === 1 &&
                    <Button color="primary" onClick={handleSignIn}>
                        Log In
                    </Button>
                    }
                    {rSelected === 2 &&
                    <Button color="primary" onClick={handleRegistration}>
                        Create Account
                    </Button>
                    }
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>

        <section id="header-section"> 
            <nav>
                <Heading as='h1' size='xl'>
                    City Lookup
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
    </>    
    );
}