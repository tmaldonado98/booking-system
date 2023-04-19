import './Header.css';
import { Heading } from '@chakra-ui/react'
import { Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import { useEffect, useState } from 'react';
// import styled from '@emotion/styled';
import axios from 'axios';

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

    ///form state
    const [emailLogValue, setEmailLogValue] = useState('');
    const [passwordLogValue, setPasswordLogValue] = useState('');

    const [emailRegValue, setPasswordRegValue] = useState('');
    const [passwordRegValue, setEmailRegValue] = useState('');

    const [valid, setValid] = useState(null);
    const [invalid, setInvalid] = useState(null);
    const [pswValid, setPswValid] = useState(null);
    const [pswInvalid, setPswInvalid] = useState(null);

    const [registrationPosted, setRegistrationPosted] = useState(null);
    const [currentAccount, setCurrentAccount] = useState(null); ///change later to useCOntext

    

    //email regex pattern
    const emailRegex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    
    const handleRegEmail = (event) => {
      const inputValue = event.target.value;
      const inputType = event.target.type;
  
      // Check if the input value matches the input type
        if (emailRegex.test(inputValue)) {
            setValid(true);
            setInvalid(false);
        } else {
            setInvalid(true);
            setValid(false);
        }
        
        setEmailRegValue(inputValue);
    };

    function handleRegPassword(event){
        setPasswordRegValue(event.target.value);
    }

    // useEffect(() => {
    //     console.log(passwordValue)
    // }, [passwordValue])

    function checkMatchingReg (event){
        if (event.target.value === passwordRegValue) {
            setPswValid(true);
            setPswInvalid(false);
        } else {
            setPswValid(false);
            setPswInvalid(true);
        }
    }
    async function handleRegistration(){
        if (emailRegex.test(emailRegValue) === true && pswValid === true) {
            await axios.post('http://localhost/booking-system/createAcct.php', {emailValue: emailRegValue, passwordValue: passwordRegValue},  
            {headers: {'Content-Type': 'application/json'}})
            .then(response => {
                setCurrentAccount(JSON.parse(response.data))
                console.log(response.data)
            })
            .then(setRegistrationPosted(true))
            .then(setEmailRegValue(''))
            .then(setPasswordRegValue(''))
            .catch(error => console.log(error))

            setPswInvalid(null);
            setPswValid(null);
        } else {
            console.log('Account not created');
            return false;
        }

    }
    useEffect(() => {
        if (registrationPosted !== null) {
            toggle();
            console.log('Logging in...');
            handleSignIn(currentAccount.email, currentAccount.password);
            
        }
    }, [registrationPosted])

    const handleLogEmail = (event) => {
        const inputValue = event.target.value;
        const inputType = event.target.type;
    
        // Check if the input value matches the input type
          if (emailRegex.test(inputValue)) {
              setValid(true);
              setInvalid(false);
          } else {
              setInvalid(true);
              setValid(false);
          }
          
          setEmailLogValue(inputValue);
      };
  
    // function handleLogPassword(event)
    //   setPasswordLogValue(event.target.value);
    // }

    async function handleSignIn (email, password){   ////POST user credentials to logIn.php .. Script checks if credentials are valid. If so, returns json object
        await axios.post('http://localhost/booking-system/logIn.php', {email: email, password: password},  
        {headers: {'Content-Type': 'application/json'}})
        .then(response => console.log(response.data))
        .then(setCurrentAccount(null))
        .then(setEmailLogValue(''))
        .then(setPasswordLogValue(''))
        .catch(error => console.log(error))

    }

    useEffect(() => {
        if (currentAccount !== null) {
            console.log(currentAccount)
            
        }
    }, [currentAccount])

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
                    value={emailLogValue}
                    onChange={handleLogEmail}
                    valid={valid}
                    invalid={invalid}
                    />
                    
                    <h4>Password</h4>
                    <Input
                        bsSize="lg"
                        type="password"
                        value={passwordLogValue}
                        onChange={(event) => setPasswordLogValue(event.target.value)}
                    />
                </ModalBody>
                }
                {rSelected === 2 &&
                <ModalBody>
                    <h4>Register Your Email Address</h4>
                  <Input
                    bsSize="lg"
                    type="email"
                    value={emailRegValue}
                    onChange={handleRegEmail}
                    valid={valid}
                    invalid={invalid}
                    />
                    
                    <h4>Create A Password</h4>
                    <Input
                        bsSize="lg"
                        value={passwordRegValue}
                        onChange={handleRegPassword}
                        type="password"
                    />
                    <h4>Confirm Your Password</h4>
                    <Input
                        bsSize="lg"
                        onChange={checkMatchingReg}
                        type="password"
                        valid={pswValid}
                        invalid={pswInvalid}
                    />
                </ModalBody>
                }
                <ModalFooter style={{justifyContent: 'center'}}>
                    {rSelected === 1 &&
                    <Button color="primary" onClick={() => handleSignIn(emailLogValue, passwordLogValue)}>
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
        <Heading as='h2'>

                *** Page is still under construction!! ***
        </Heading>
    </>    
    );
}