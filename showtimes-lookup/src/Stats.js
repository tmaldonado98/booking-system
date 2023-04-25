import { Heading, Text, Input, Button } from '@chakra-ui/react';
import { Alert, Progress } from 'reactstrap';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react';
// import { Helmet } from 'react-helmet';
import axios from 'axios';
import {FaRegBookmark, FaBookmark} from 'react-icons/fa';
import {
    UncontrolledAccordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
  } from 'reactstrap';

import { useContext, useEffect, useState } from 'react';
import MyContext from './Context';

import './stats.css';

export default function Stats(props) {
    const [slug, setSlug] = useState(null);
    const [scores, setScores] = useState(null);
    const [show, setShow] = useState(false);
    const [imgUrl, setImgUrl] = useState('');
    const [salaryInfo, setSalaryInfo] = useState(null);
    const [saved, setSaved] = useState(false); //for bookmark status
    const [loggedIn, setLoggedIn] = useContext(MyContext); ///authenticated status context


    const [{ selectedPlace, setSelectedPlace }, { selectedGeo, setSelectedGeo }] = useContext(MyContext);

    function setScoreFromSlug(){
        console.log(slug)
        axios.get(`${slug._links['ua:scores'].href}`,
        {headers: {'Content-Type': 'application/json'}})
        .then(response => {
            setScores(response.data)
        })
    }

    useEffect(() => {
        if (!props.data._links['city:urban_area']) {
            setSlug(null)
        } else{
        axios.get(`${props.data['_links']['city:urban_area']['href']}`,
        {headers: {'Content-Type': 'application/json'}})
        .then(response => {
            setSlug(response.data)
            // console.log(response.data)
        })
        .catch(error => console.log(error))
        }
        
    }, [selectedGeo])

    useEffect(() => {
        ///This ensures that score is set only after slug has been set. 
        ///If I use .then, or even useEffect, they do not wait until axios response.
        if (slug !== null) {
            setScoreFromSlug();
            if (slug === null) {
                return false;
            } else{
            axios.get(`${slug._links['ua:images']['href']}`,
            {headers: {'Content-Type': 'application/json'}})
            .then(response => {
                setImgUrl(response.data)
            });

            axios.get(`${slug._links['ua:salaries']['href']}`,
            {headers: {'Content-Type': 'application/json'}})
            .then(response => {
                setSalaryInfo(response.data)
            });
            }
          }
    }, [slug])

    ///alert state
    const [visible, setVisible] = useState(false);

    const onDismiss = () => setVisible(false);

    function setShowUnauth() {
        setVisible(true);
        setTimeout(() => {
            // document.getElementById('unauth-msg').style('display, block');
            setVisible(false)
        }, 6000)
    }

    function handleSaveUnauth() {
        setShowUnauth();
        console.log(loggedIn)
        // if (loggedIn === false) {
        //     setShowUnauth();
        // } else if (loggedIn === true){
        //     setSaved(!saved);
        // }

    }

    function handleUnsave(){
        //// axios.post
    }

    return (
        <>
            <Alert color="info" isOpen={visible} toggle={onDismiss}>
                You need to be logged into your account in order to save places to your list.
            </Alert>
        <div id='heading-w-bookmark'>
            <Heading style={{textAlign: 'center'}} as='h4'>{props.data.full_name}</Heading>
            {saved === false ? <div className='bookmarked'><FaRegBookmark style={{cursor: 'pointer'}} onClick={handleSaveUnauth}/></div> : <div className='bookmarked'><FaBookmark style={{cursor: 'pointer'}} onClick={handleUnsave}/><span>Saved To Your List!</span></div>}
        {/* change event for second bookmark case */}
        </div>
            <div id='img-w-summary'>
                {imgUrl && <img src={imgUrl.photos[0].image.web} />}
                {scores && <p dangerouslySetInnerHTML={{ __html: scores.summary}} id='summary'></p>}            
            </div>
            
            <div className="chart">
                {/* <h4>Population: {(props.data.population).toLocaleString('us')}</h4> */}
                <div className='individual-divs' style={{opacity: 0}}><p style={{margin:0}}>0<span>00</span></p><Progress value={0}/></div>

                {scores !== null &&
                        scores['categories'].map(each => {
                            const barWidth = (Number(each.score_out_of_10) * 10).toFixed(0);
                            
                            let level = '';
                            if(barWidth <= 30){
                                level = 'danger';
                            } else if(barWidth > 30 && barWidth < 65){
                                level = 'warning'
                            } else if(barWidth >= 65){
                                level = 'success';
                            }

                            return (
                            <div className='individual-divs'>
                                <p style={{fontWeight: 'bold'}}>{each.name} - <span className='number'>{(Number(each.score_out_of_10) * 10).toFixed(1)}%</span></p>
                                    
                                    <Progress
                                        animated
                                        color={level}
                                        striped
                                        value={barWidth}
                                        />
                            </div>
                            )
                        })                       
                }

            </div>

            <section id='salary-info'>
                <UncontrolledAccordion stayOpen>
                    <AccordionItem>
                        <AccordionHeader targetId='1'><h4>Salaries Per Profession</h4></AccordionHeader>
                        <AccordionBody accordionId="1">
                            {/* <Heading as='h2'>Salaries</Heading> */}
                            {/* <p>data here....................</p> */}
                            {console.log(salaryInfo)}
                            {/* <div id='salary-list'> */}
                                {salaryInfo !== null && salaryInfo.salaries.map((each) => {
                                    <div key={each.job.id}>
                                        <p>{each.job.title}</p>
                                        {/* <Card  key={each.job.id}>
                                            <CardHeader>
                                                <Heading>
                                                    {each.job.title}
                                                </Heading>
                                            </CardHeader>
                                                {(each.salary_percentiles.percentile_50).toFixed(0)}
                                            {/* <CardBody>
                                            </CardBody>
                                        </Card>  */}
                                    </div>
                                })
                                }
                            {/* </div> */}
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionHeader targetId='2'><h4>Cost Of Living</h4></AccordionHeader>
                        <AccordionBody accordionId="2">
                            {/* <Heading as='h2'>Cost Of Living</Heading> */}
                            <p>data here....................</p>
                            {/* {console.log(salaryInfo)} */}
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionHeader targetId='3'><h4>Some Facts</h4></AccordionHeader>
                        <AccordionBody accordionId='3'>
                                <p>fs</p>
                        </AccordionBody>
                    </AccordionItem>
                </UncontrolledAccordion>
            </section>

        </>
    );
}