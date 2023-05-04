import { Heading, Text, Input, Button } from '@chakra-ui/react';
import { Alert, Progress, DropdownToggle, DropdownMenu, DropdownItem, Dropdown, } from 'reactstrap';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import axios from 'axios';
import {FaRegBookmark, FaBookmark, FaPlusCircle} from 'react-icons/fa';
import { FcCheckmark, } from 'react-icons/fc';
import {IoIosAdd} from 'react-icons/io';
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
    const [slugDetails, setSlugDetails] = useState(null);
    const [geonameId, setGeonameId] = useState(null);
    const [latLon, setLatLon] = useState(null);

    const [saved, setSaved] = useState(false); //for bookmark status

    const [activeAccordionId, setActiveAccordionId] = useState(null);

    const handleAccordionToggle = (accordionId) => {
      setActiveAccordionId(activeAccordionId === accordionId ? null : accordionId);
    };

    const { selectedPlace, setSelectedPlace ,  selectedGeo, setSelectedGeo , mapCreated, setMapCreated, currentAccount, setCurrentAccount} = useContext(MyContext);

    function setScoreFromSlug(){
        // console.log(slug)
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
                setSlugDetails(response.data)
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
    // const [visibleSignIn, setVisibleSignIn] = useState(false);
    // const [visibleSignOut, setVisibleSignOut] = useState(false);


    const onDismiss = () => setVisible(false);
    // const onDismissSignInAlert = () => setVisibleSignIn(false);
    // const onDismissSignOut = () => setVisibleSignOut(false);

    function setShowUnauth() {
        setVisible(true);
        setTimeout(() => {
            // document.getElementById('unauth-msg').style('display, block');
            setVisible(false)
        }, 6000)
    }

    // function setShowSuccessSignIn() {
    //     setVisibleSignIn(true);
    //     setTimeout(() => {
    //         setVisibleSignIn(false)
    //     }, 6000)
    // }

    // function setShowSignOut() {
    //     setVisibleSignOut(true);
    //     setTimeout(() => {
    //         setVisibleSignOut(false)
    //     }, 6000)
    // }


    // useEffect(() => {
    //     if (currentAccount) {
    //         setShowSuccessSignIn();
    //     }
    //     else if (!currentAccount){
    //         setShowSignOut();
    //     }

    // }, [currentAccount])

    
    ////state for lists dropdown
    const [listsDropdownOpen, setListsDropdownOpen] = useState(false);

    const toggleLists = () => setListsDropdownOpen((prevState) => !prevState);


    function handleSaveUnsave() {
        // setShowUnauth();
        // console.log(loggedIn)
        if (!currentAccount) {
            setShowUnauth();
        } else if (currentAccount){
            setSaved(!saved);
            toggleLists();
        }

    }

    function handleUnsave(){
        //// axios.post
    }

////Maptiler code block
    useEffect(() => {
        if (mapCreated === false) {
            document.getElementById('map-container').innerHTML = '';
        }

        // console.log(process.env.REACT_APP_MAPTILER_API);

        if (activeAccordionId === '3' && mapCreated === false) {
            setMapCreated(true); 
            maptilersdk.config.apiKey = 'w2XzC62C0m417hgxO9LK'; ///

            let lng = geonameId.location.latlon.longitude;
            let lat = geonameId.location.latlon.latitude;
            setLatLon({lon:lng, lati:lat});

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
            {/* <Alert color="success" isOpen={visibleSignIn} toggle={onDismissSignInAlert}>
                You have successfully signed in!
            </Alert>

            <Alert color="primary" isOpen={visibleSignOut} toggle={onDismissSignOut}>
                You have successfully signed out.
            </Alert> */}

            <Alert color="info" isOpen={visible} toggle={onDismiss}>
                You need to be logged into your account in order to save places to your list.
            </Alert>
        <div id='heading-w-bookmark'>
            <Heading style={{textAlign: 'center'}} as='h4'>{props.data.name + ', ' + props.data._links['city:country'].name}</Heading>
            {/* <Heading style={{textAlign: 'center'}} as='h4'>{selectedGeo.name}</Heading> */}
            {/* {saved === false ? <div className='bookmarked'><FaPlusCircle style={{cursor: 'pointer'}} onClick={handleSaveUnsave}/></div> : <div className='bookmarked'><FaPlusCircle style={{cursor: 'pointer'}} onClick={handleSaveUnsave}/><span>Saved To Your List!</span></div>} */}
        {/* change event for second bookmark case */}
            {/* <FaPlusCircle style={{cursor: 'pointer'}}  /> */}
                <Dropdown toggle={handleSaveUnsave} isOpen={listsDropdownOpen} direction={'end'}>
                  <DropdownToggle caret>Add To List </DropdownToggle>
                  <DropdownMenu >
                    <DropdownItem header>Your Lists</DropdownItem>
                    <DropdownItem>{<div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>List One <IoIosAdd /></div>}</DropdownItem>  
                    {/* conditionally render this component <FcCheckmark /> if this city is added to this specific list */}
                    <DropdownItem divider />
                    <DropdownItem>Create A New List </DropdownItem>
                  {/* style={{display:'flex', flexDirection:'column', alignItems:'center'}} <FaPlusCircle /> */}
                  </DropdownMenu>
                </Dropdown>
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

                    <AccordionItem>
                        <AccordionHeader targetId='1'><h4>Salaries Per Profession</h4></AccordionHeader>
                        <AccordionBody accordionId="1">
                            <Heading style={{textAlign:'center'}} as='h2'>Annual Salaries</Heading>
                            <h4 style={{marginBottom:'28px'}}>(Average In USD)</h4>
                            {/* {console.log(salaryInfo)} */}
                            <div id='salary-list' className='accordion-content'>
                                <ul>
                                {salaryInfo !== null && salaryInfo.salaries.map((each) => (
                                    <li key={each.job.id}>
                                                <h5>
                                                    {each.job.title}
                                                </h5>
                                                <p>
                                                    ${Number((each.salary_percentiles.percentile_50).toFixed(0)).toLocaleString('us')}
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
                            <h4 style={{marginBottom:'28px'}}>(Average In USD)</h4>
                            <section id='cost-of-living-section'>
                                <div id='housing' className='cost-of-living-div accordion-content'>
                                    <ul>
                                    {slugDetails !== null && slugDetails.categories[8].data.slice(0,3).map((each) => (
                                        <li key={each.id}>
                                                    <h5>
                                                        {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                                    </h5>
                                                    <p>
                                                        {each.currency_dollar_value ? '$' + (each.currency_dollar_value).toLocaleString('us') : ''}
                                                    </p>
                                        </li>
                                    ))
                                    }
                                    </ul>
                                </div>

                                <div id='groceries' className='cost-of-living-div accordion-content'>
                                    <ul>
                                    {slugDetails !== null && slugDetails.categories[3].data.slice(1,10).map((each) => (
                                        <li key={each.id}>
                                                    <h5>
                                                        {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                                    </h5>
                                                    <p>
                                                        ${(each.currency_dollar_value)}
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
                            <section id='economy-section'>
                                <div id='economy-div' className=' accordion-content'>
                                    <h4>GDP</h4>
                                    <h6 style={{marginBottom:'28px'}}>(Average In USD)</h6>
                                    <ul>
                                    {slugDetails !== null && slugDetails.categories[5].data.slice(2,5).map((each) => (
                                        <li key={each.id}>
                                            <h5>
                                                {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                            </h5>
                                            <p>
                                                {each.currency_dollar_value ? '$' + Number(each.currency_dollar_value.toFixed(0)).toLocaleString('us') : each.percent_value ? ((each.percent_value) * 100).toFixed(1) + ' %' : each.currency_dollar_value}
                                            </p>
                                        </li>
                                        
                                    ))
                                    }
                                    </ul>
                                </div>

                                <div id='business-div' className=' accordion-content'>
                                    <h4>Business Freedom & Labor Restrictions</h4>
                                    <ul>
                                    {slugDetails !== null && slugDetails.categories[0].data.slice(0, 2).map((each) => (
                                        <li key={each.id}>
                                            <h5>
                                                {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                            </h5>
                                            <p>
                                                {each.float_value ? (each.float_value).toFixed(0) : each.percent_value ? ((each.percent_value) * 100).toFixed(1) +'%' : each.int_value ? each.int_value : each.string_value ? each.string_value : ''} / 100
                                            </p>
                                        </li>
                                    ))
                                    }
                                    {slugDetails !== null && slugDetails.categories[0].data.slice(4,6).map((each) => (
                                        <li key={each.id}>
                                            <h5>
                                                {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                            </h5>
                                            <p>
                                                {each.float_value ? (each.float_value).toFixed(2) : each.percent_value ? ((each.percent_value) * 100).toFixed(1) +'%' : each.int_value ? (each.int_value * 100).toFixed(0) : each.string_value ? each.string_value : ''}
                                            </p>
                                        </li>
                                    ))
                                    }
                                    </ul>
                                </div>

                                <div id='corruption-div' className=' accordion-content'>
                                    <h4>Corruption</h4>
                                    <ul>
                                    {slugDetails !== null && slugDetails.categories[0].data.slice(2,4).map((each) => (
                                        <li key={each.id}>
                                            <h5>
                                                {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                            </h5>
                                            <p>
                                                {each.float_value ? (each.float_value).toFixed(2) : each.percent_value ? ((each.percent_value) * 100).toFixed(1) +'%' : each.int_value ? each.int_value : each.string_value ? each.string_value : ''} / 100
                                            </p>
                                        </li>
                                    ))
                                    }
                                    </ul>
                                </div>

                                <div id='population-div' className=' accordion-content'>
                                    <h4>Population</h4>
                                    <ul>
                                    {slugDetails !== null && slugDetails.categories[1].data.slice(2,4).map((each) => (
                                        <>
                                        <li>
                                            <h5>
                                                City Total Population
                                            </h5>
                                            <p>
                                                {(selectedGeo.population).toLocaleString('us')}
                                            </p>
                                        </li>
                                        <li key={each.id}>
                                            <h5>
                                                {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                            </h5>

                                            <p>
                                                {Number((each.float_value.toFixed(0))).toLocaleString('us')} / 100
                                            </p>
                                        </li>
                                        </>
                                    ))
                                    }
                                    </ul>
                                </div>
                            </section>

                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionHeader targetId='5'><h4>Education</h4></AccordionHeader>
                        <AccordionBody accordionId='5'>
                            <h4>PISA & University Scores</h4>
                            {/* <h4 style={{marginBottom:'28px'}}>(Average)</h4> */}
                            <section id='education-section'>
                                <div id='education-div' className=' accordion-content'>
                                    <ul>
                                        {/* .slice(0,3) */}
                                    {slugDetails !== null && slugDetails.categories[6].data.map((each) => (
                                        <li key={each.id}>
                                            <h5>
                                                {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                            </h5>
                                            <p>
                                                {each.float_value ? (each.float_value).toFixed(2) : each.percent_value ? ((each.percent_value) * 100).toFixed(1) +'%' : each.int_value ? each.int_value : each.string_value ? each.string_value : ''}
                                            {/*  */}
                                            </p>
                                        </li>
                                    ))
                                    }
                                    </ul>
                                </div>
                            </section>

                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionHeader targetId='6'><h4>Leisure, Language & Internet</h4></AccordionHeader>
                        <AccordionBody accordionId='6'>
                            <section id='culture-section'>
                                <div id='leisure-div' className=' accordion-content'>
                                    <h4>Leisure</h4>
                                    <ul>
                                        {/* .slice(0,3) */}
                                    {slugDetails !== null && slugDetails.categories[4].data.map((each) => (
                                        <li key={each.id}>
                                            <h5>
                                                {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                            </h5>
                                            <p>
                                                {each.float_value ? (each.float_value).toFixed(2) : each.percent_value ? ((each.percent_value) * 100).toFixed(1) +'%' : each.int_value ? each.int_value : each.string_value ? each.string_value : ''}
                                            {/*  */}
                                            </p>
                                        </li>
                                    ))
                                    }
                                    </ul>
                                </div>

                                <div id='language-div' className=' accordion-content'>
                                    <h4>Language(s)</h4>
                                    <ul>
                                        {/* .slice(0,3) */}
                                    {slugDetails !== null && slugDetails.categories[11].data.slice(0, 1).map((each) => (
                                        <li key={each.id}>
                                            <h5>
                                                {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                            </h5>
                                            <p>
                                                {each.float_value ? (each.float_value).toFixed(2) : each.percent_value ? ((each.percent_value) * 100).toFixed(1) +'%' : each.int_value ? each.int_value : each.string_value ? each.string_value : ''} / 100
                                            </p>
                                        </li>
                                    ))
                                    }
                                    {slugDetails !== null && slugDetails.categories[11].data.slice(2).map((each) => (
                                        <li key={each.id}>
                                            <h5>
                                                {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                            </h5>
                                            <p>
                                                {each.float_value ? (each.float_value).toFixed(2) : each.percent_value ? ((each.percent_value) * 100).toFixed(1) +'%' : each.int_value ? each.int_value : each.string_value ? each.string_value : ''}
                                            </p>
                                        </li>
                                    ))
                                    }

                                    </ul>
                                </div>

                                <div id='internet-div' className=' accordion-content'>
                                    <h4>Internet</h4>
                                    <ul>
                                    {slugDetails !== null && slugDetails.categories[13].data.slice(0, 1).map((each) => (
                                        <li key={each.id}>
                                            <h5>
                                                Average {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                            </h5>
                                            <p>
                                                {each.float_value ? (each.float_value).toFixed(2) : each.percent_value ? ((each.percent_value) * 100).toFixed(1) +'%' : each.int_value ? each.int_value : each.string_value ? each.string_value : ''} / 100
                                            </p>
                                        </li>
                                    ))
                                    }
                                    {slugDetails !== null && slugDetails.categories[13].data.slice(2,3).map((each) => (
                                        <li key={each.id}>
                                            <h5>
                                                Average     {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                            </h5>
                                            <p>
                                                {each.float_value ? (each.float_value).toFixed(2) : each.percent_value ? ((each.percent_value) * 100).toFixed(1) +'%' : each.int_value ? each.int_value : each.string_value ? each.string_value : ''}
                                            </p>
                                        </li>
                                    ))
                                    }
                                    </ul>
                                </div>
                            </section>

                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionHeader targetId='7'><h4>LGBT Community</h4></AccordionHeader>
                        <AccordionBody accordionId='7'>
                            <section id='tolerance-section'>
                                <div id='lgbt-div' className=' accordion-content'>
                                    <ul>
                                        {/* */}
                                    {slugDetails !== null && slugDetails.categories[12].data.slice(0,11).map((each) => (
                                        <li key={each.id}>
                                            <h5>
                                                {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                            </h5>
                                            <p>
                                                {each.float_value ? (each.float_value).toFixed(2) : each.percent_value ? ((each.percent_value) * 100).toFixed(1) +'%' : each.int_value ? each.int_value : each.string_value ? each.string_value : ''}
                                            {/*  */}
                                            </p>
                                        </li>
                                    ))
                                    }
                                    </ul>
                                </div>
                            </section>

                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionHeader targetId='9'><h4>Weather, Safety, Pollution</h4></AccordionHeader>
                        <AccordionBody accordionId='9'>
                            <section id='wellbeing-section'>
                                <div id='weather-div' className=' accordion-content'>
                                    <h4>Weather</h4>
                                    <h6 style={{marginBottom:'28px'}}>(Yearly Average)</h6>
                                    <ul>
                                    {slugDetails !== null && slugDetails.categories[2].data.map((each) => (
                                        <li key={each.id}>
                                            <h5>
                                                {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                            </h5>
                                            <p>
                                                {each.float_value ? Number((each.float_value)).toFixed(1) : each.percent_value ? ((each.percent_value) * 100).toFixed(1) +'%' : each.int_value ? each.int_value : each.string_value ? each.string_value : ''}
                                            </p>
                                        </li>
                                    ))
                                    }
                                    </ul>
                                </div>

                                <div id='safety-div' className=' accordion-content'>
                                    <h4>Safety</h4>
                                    <ul>
                                    {slugDetails !== null && slugDetails.categories[16].data.map((each) => (
                                        <li key={each.id}>
                                            <h5>
                                                {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                            </h5>
                                            <p>
                                                {each.float_value ? (each.float_value).toFixed(2) : each.percent_value ? ((each.percent_value) * 100).toFixed(1) +'%' : each.int_value ? each.int_value : each.string_value ? each.string_value : ''}
                                            </p>
                                        </li>
                                    ))
                                    }
                                    </ul>
                                </div>

                                <div id='pollution-div' className=' accordion-content'>
                                    <h4>Pollution</h4>
                                    <ul>
                                    {slugDetails !== null && slugDetails.categories[15].data.map((each) => (
                                        <li key={each.id}>
                                            <h5>
                                                {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                            </h5>
                                            <p>
                                                {each.float_value ? (each.float_value * 100).toFixed(2) : each.percent_value ? ((each.percent_value) * 100).toFixed(1) +'%' : each.int_value ? each.int_value : each.string_value ? each.string_value : ''} / 100
                                            </p>
                                        </li>
                                    ))
                                    }
                                    </ul>
                                </div>
                            </section>

                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem> 
                        <AccordionHeader targetId='10'><h4>Healthcare</h4></AccordionHeader>
                        <AccordionBody accordionId='10'>
                            <section id='healthcare-section'>
                                <div id='healthcare-div' className=' accordion-content'>
                                    {/* <h4>Healthcare</h4> */}
                                    <ul>
                                    {slugDetails !== null && slugDetails.categories[7].data.slice(0,1).map((each) => (
                                        <li key={each.id}>
                                            <h5>
                                                {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                            </h5>
                                            <p>
                                                {each.float_value ? (each.float_value * 100).toFixed(0) : each.percent_value ? ((each.percent_value) * 100).toFixed(1) +'%' : each.int_value ? each.int_value : each.string_value ? each.string_value : ''} / 100
                                            </p>
                                        </li>
                                    ))
                                    }

                                    {slugDetails !== null && slugDetails.categories[7].data.slice(1,2).map((each) => (
                                        <li key={each.id}>
                                            <h5>
                                                Average {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                            </h5>
                                            <p>
                                                {each.float_value ? (each.float_value).toFixed(0) : each.percent_value ? ((each.percent_value) * 100).toFixed(1) +'%' : each.int_value ? each.int_value : each.string_value ? each.string_value : ''} years
                                            </p>
                                        </li>
                                    ))
                                    }

                                    {slugDetails !== null && slugDetails.categories[7].data.slice(2,3).map((each) => (
                                        <li key={each.id}>
                                            <h5>
                                                {each.label.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                            </h5>
                                            <p>
                                                {each.float_value ? (each.float_value * 100).toFixed(0) : each.percent_value ? ((each.percent_value) * 100).toFixed(1) +'%' : each.int_value ? each.int_value : each.string_value ? each.string_value : ''} / 100
                                            </p>
                                        </li>
                                    ))
                                    }
                                    </ul>
                                </div>
                            </section>

                        </AccordionBody>
                    </AccordionItem>

                </UncontrolledAccordion>
            </section>

        </>
    );
}