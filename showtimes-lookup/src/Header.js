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
    
    const [emailRegValue, setEmailRegValue] = useState('');
    const [passwordRegValue, setPasswordRegValue] = useState('');
    const [nameRegValue, setNameRegValue] = useState('');

    const [pswValid, setPswValid] = useState(null);
    const [pswInvalid, setPswInvalid] = useState(null);

    const [regValid, setRegValid] = useState(null);
    const [regInvalid, setRegInvalid] = useState(null);

    const [logValid, setLogValid] = useState(null);    
    const [logInvalid, setLogInvalid] = useState(null);

    const [registrationPosted, setRegistrationPosted] = useState(null);
    const [currentAccount, setCurrentAccount] = useState(null); ///change later to useCOntext

    

    //email regex pattern
    const emailRegex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    
    const handleRegEmail = (event) => {
    //   const emailRegValue = event.target.value;
      const inputType = event.target.type;
  
      // Check if the input value matches the input type
        if (emailRegex.test(event.target.value)) {
            setRegValid(true);
            setRegInvalid(false);
        } else {
            setRegInvalid(true);
            setRegValid(false);
        }
        
        setEmailRegValue(event.target.value);
    };

    function handleRegPassword(event){
        setPasswordRegValue(event.target.value);
    }
    function handleRegName(event){
        setNameRegValue(event.target.value);
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
            await axios.post('http://localhost/booking-system/createAcct.php', {emailValue: emailRegValue, passwordValue: passwordRegValue, nameValue: nameRegValue},  
            {headers: {'Content-Type':'application/json'}})
            .then(response => {
                setCurrentAccount(response.data);
            })
            .then(setRegistrationPosted(true))
            .then(alert('Account created!'))
            .then(async () => await handleSignIn(currentAccount.email, currentAccount.password))
            .then(setEmailRegValue(''))
            .then(setPasswordRegValue(''))
            .catch(error => console.log(error))

            // setPswInvalid(null);
            // setPswValid(null);
        } else {
            console.log('Account not created');
            return false;
        }

    }
    useEffect(() => {
        if (registrationPosted !== null) {
            toggle();
            console.log('Logging in...');
            // handleSignIn(currentAccount.email, currentAccount.password);
            
        }
    }, [registrationPosted])

    const handleLogEmail = (event) => {
        const inputValue = event.target.value;
        const inputType = event.target.type;
    
        // Check if the input value matches the input type
        //   if (emailRegex.test(inputValue)) {
        //       setLogValid(true);
        //       setLogInvalid(false);
        //   } else {
        //       setLogInvalid(true);
        //       setLogValid(false);
        //   }
          
          setEmailLogValue(inputValue);
      };
  
    // function handleLogPassword(event)
    //   setPasswordLogValue(event.target.value);
    // }

    async function handleSignIn (address, pass){   ////POST user credentials to logIn.php .. Script checks if credentials are valid. If so, returns json object
        if (emailRegex.test(emailLogValue) === true && passwordLogValue.length > 0) {
            await axios.post('http://localhost/booking-system/logIn.php', {email: address, password: pass},  
            {headers: {'Content-Type': 'application/json'}})
            ///If account does not exist in database, response from php as false; else send object
            .then(response => {
                console.log(response.data);
                setCurrentAccount(response.data);
            })
            // .then(setCurrentAccount(null))
            .then(setEmailLogValue(''))
            .then(setPasswordLogValue(''))
            // .then(console.log('Logged in!'))
            .catch(error => console.log(error))
        } else {
            return false; ///later set error validation
        }
    }

    useEffect(() => {
        if (currentAccount !== null && currentAccount !== false) {
            console.log(currentAccount);
            console.log('Logged In!');
            // handleSignIn(currentAccount.email, currentAccount.password);
        }
        else if (currentAccount === false){
            console.log('User account does not exist in our records!')
        }
        console.log(currentAccount)
    }, [currentAccount])

    return(
    <>
        <div id='nav'>          
            <div id='nav-buttons'>
                <Button onClick={toggle}>Log In/Sign Up</Button>
            </div>
        </div>
        {!currentAccount &&
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
                    // valid={logValid}
                    // invalid={logInvalid}
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
                    // value={emailRegValue}
                    onChange={handleRegEmail}
                    valid={regValid}
                    invalid={regInvalid}
                    />
                    
                    <h4>Create A Password</h4>
                    <Input
                        bsSize="lg"
                        // value={passwordRegValue}
                        onChange={handleRegPassword}
                        // onChange={(event) => setPasswordRegValue(event.target.value)}
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

                    <h4>What Should We Call You?</h4>
                    <Input
                        bsSize="lg"
                        onChange={handleRegName}
                        type="text"
                    />

                </ModalBody>
                }
                <ModalFooter style={{justifyContent: 'center'}}>
                    {rSelected === 1 &&
                    <Button color="primary" 
                    onClick={() => handleSignIn(emailLogValue, passwordLogValue)}
                    >
                        Log In
                    </Button>
                    }
                    {rSelected === 2 &&
                    <Button color="primary" 
                    onClick={handleRegistration}
                    >
                        Create Account
                    </Button>
                    }
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        }
        {/* {currentAccount &&
            ///account dashboard, can be in modal. Show list


        } */}

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