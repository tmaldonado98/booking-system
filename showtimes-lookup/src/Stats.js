import { Heading, Text, Input, Button } from '@chakra-ui/react';
import { Alert, Progress } from 'reactstrap';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
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
    const [costLiving, setCostLiving] = useState(null);
    const [geonameId, setGeonameId] = useState(null);
    const [latLon, setLatLon] = useState(null);

    const [images, setImages] = useState(null);

    const [saved, setSaved] = useState(false); //for bookmark status
    // const [loggedIn, setLoggedIn] = useContext(MyContext); ///authenticated status context

    const [activeAccordionId, setActiveAccordionId] = useState(null);

    const handleAccordionToggle = (accordionId) => {
      setActiveAccordionId(activeAccordionId === accordionId ? null : accordionId);
    };

    const [provokeRender, setProvokeRender] = useState(false);

    const { selectedPlace, setSelectedPlace ,  selectedGeo, setSelectedGeo , mapCreated, setMapCreated} = useContext(MyContext);

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

            axios.get(`${slug._links['ua:details']['href']}`,
            {headers: {'Content-Type': 'application/json'}})
            .then(response => {
                setCostLiving(response.data)
            });

            axios.get(`${slug._links['ua:identifying-city']['href']}`,
            {headers: {'Content-Type': 'application/json'}})
            .then(response => {
                setGeonameId(response.data)
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
        // console.log(loggedIn)
        // if (loggedIn === false) {
        //     setShowUnauth();
        // } else if (loggedIn === true){
        //     setSaved(!saved);
        // }

    }

    function handleUnsave(){
        //// axios.post
    }

////Maptiler code block
    useEffect(() => {
        if (mapCreated === false) {
            document.getElementById('map-container').innerHTML = '';
        }


        if (activeAccordionId === '3' && mapCreated === false) {
            console.log('hey');
            setMapCreated(true);
            maptilersdk.config.apiKey = '';
            console.log(process.env.MAPTILER_API);

            let lng = geonameId.location.latlon.longitude;
            let lat = geonameId.location.latlon.latitude;
            setLatLon({lon:lng, lati:lat});
            console.log(lng, lat);

            const map = new maptilersdk.Map({
            container: 'map-container', // container's id or the HTML element to render the map
            style: maptilersdk.MapStyle.STREETS,
            center: [lng, lat], // starting position [lng, lat]
            zoom: 9, // starting zoom;

            });

            const marker = new maptilersdk.Marker()
            .setLngLat([lng, lat])
            .addTo(map);
    
        } 

    }, [activeAccordionId])
////


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
                <div className='individual-divs'>
                    {/* <p style={{margin:0}}>0<span>00</span></p> */}
                    <u><p style={{textAlign:'center'}}>Source: <a href='https://teleport.org/cities/' target='_blank' rel='noreferrer noopener'>Teleport</a></p></u>
                    <Progress style={{opacity: 0}} value={0}/>
                </div>

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

            <section id='accordion'>
                <UncontrolledAccordion stayOpen>

                    {/* <AccordionItem onClick={() => handleAccordionToggle('0')}>
                        <AccordionHeader isOpen={activeAccordionId ===  '0'} targetId='0'><h4>Images</h4></AccordionHeader>
                        <AccordionBody accordionId="0">
                            {/* <Heading style={{textAlign:'center', marginBottom:'28px'}} as='h2'>Monthly Cost Of Living</Heading> */}
                            {/* <p>Images here....................</p> */}
                            {/* {console.log(salaryInfo)} */}
                        {/* </AccordionBody> 
                    </AccordionItem> */}


                    <AccordionItem>
                        <AccordionHeader targetId='1'><h4>Salaries Per Profession</h4></AccordionHeader>
                        <AccordionBody accordionId="1">
                            <Heading style={{textAlign:'center'}} as='h2'>Annual Salaries</Heading>
                            <h4 style={{marginBottom:'28px'}}>(Average)</h4>
                            {/* {console.log(salaryInfo)} */}
                            <div id='salary-list' className='accordion-content'>
                                <ul>
                                {salaryInfo !== null && salaryInfo.salaries.map((each) => (
                                    <li key={each.job.id}>
                                                <h5>
                                                    {each.job.title}
                                                </h5>
                                                <p>
                                                    USD ${(each.salary_percentiles.percentile_50).toLocaleString('us')}
                                                </p>
                                    </li>
                                ))
                                }
                                </ul>
                            </div>
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionHeader targetId='2'><h4>Cost Of Living</h4></AccordionHeader>
                        <AccordionBody accordionId="2">
                            <Heading style={{textAlign:'center'}} as='h2'>Monthly Cost Of Living</Heading>
                            <h4 style={{marginBottom:'28px'}}>(Average)</h4>
                            <section id='cost-of-living-section'>
                                <div id='housing' className='cost-of-living-div accordion-content'>
                                    <ul>
                                        {console.log(costLiving)}
                                    {costLiving !== null && costLiving.categories[8].data.slice(0,3).map((each) => (
                                        <li key={each.id}>
                                                    <h5>
                                                        {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                                    </h5>
                                                    <p>
                                                        USD ${(each.currency_dollar_value)}
                                                    </p>
                                        </li>
                                    ))
                                    }
                                    </ul>
                                </div>

                                <div id='groceries' className='cost-of-living-div accordion-content'>
                                    <ul>
                                    {costLiving !== null && costLiving.categories[3].data.slice(1,10).map((each) => (
                                        <li key={each.id}>
                                                    <h5>
                                                        {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                                    </h5>
                                                    <p>
                                                        USD ${(each.currency_dollar_value)}
                                                    </p>
                                        </li>
                                    ))
                                    }
                                    </ul>
                                </div>

                            </section>
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem onClick={() => handleAccordionToggle('3')}>
                        <AccordionHeader isOpen={activeAccordionId ===  '3'} targetId='3'><h4>Map</h4></AccordionHeader>
                        <AccordionBody accordionId='3' id='map-accordion'>
                                <div id='map-container'></div>
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionHeader targetId='4'><h4>Economy & Population</h4></AccordionHeader>
                        <AccordionBody accordionId='4'>
                                <p>fs</p>
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionHeader targetId='5'><h4>Education</h4></AccordionHeader>
                        <AccordionBody accordionId='5'>
                                <p>fs</p>
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionHeader targetId='6'><h4>Culture & Language</h4></AccordionHeader>
                        <AccordionBody accordionId='6'>
                                <p>fs</p>
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionHeader targetId='7'><h4>Social Tolerance</h4></AccordionHeader>
                        <AccordionBody accordionId='7'>
                                <p>fs</p>
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionHeader targetId='8'><h4>Leisure & Internet</h4></AccordionHeader>
                        <AccordionBody accordionId='8'>
                                <p>fs</p>
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionHeader targetId='9'><h4>Weather, Safety, Pollution</h4></AccordionHeader>
                        <AccordionBody accordionId='9'>
                                <p>fs</p>
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem> 
                        <AccordionHeader targetId='10'><h4>Entrepeneurship & Taxation</h4></AccordionHeader>
                        <AccordionBody accordionId='10'>
                                <p>fs</p> 
                                 {/*  VC, Taxation, Startups  */}
                        </AccordionBody>
                    </AccordionItem>

                </UncontrolledAccordion>
            </section>

        </>
    );
}