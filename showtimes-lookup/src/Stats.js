import { Heading, Text, Input, Button } from '@chakra-ui/react';
import { Progress } from 'reactstrap';
import { Helmet } from 'react-helmet';
import axios from 'axios';

import { useEffect, useState } from 'react';

import './stats.css';

export default function Stats(props) {
    const [slug, setSlug] = useState(null);
    const [scores, setScores] = useState(null);
    const [show, setShow] = useState(false);
    const [imgUrl, setImgUrl] = useState('');
    // console.log(props.data['_links']['city:urban_area']['href'])

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
        
        document.cookie = "SameSite=None; Secure";

    }, [])

    useEffect(() => {
        ///This ensure that score is set only after slug has been set. 
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
            }
          }
    }, [slug])


    return (
        <>
            <Heading style={{textAlign: 'center'}} as='h4'>{props.data.full_name}</Heading>
            <div id='img-w-summary'>
                {imgUrl && <img src={imgUrl.photos[0].image.web} />}
                {scores && <p dangerouslySetInnerHTML={{ __html: scores.summary}} id='summary'></p>}            </div>
            
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

                            const low = barWidth <= 30 && 'warning';

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
                {/* {slug && 
                <div id='widget'>
                    <a className="teleport-widget-link" href={`https://teleport.org/cities/${slug.slug}/`}>Cost of living - {slug.name}</a>
                    <Helmet>
                        <script async class="teleport-widget-script" data-url={`https://teleport.org/cities/${slug.slug}/widget/costs/?currency=USD`} data-max-width="770" data-height="955" src="https://teleport.org/assets/firefly/widget-snippet.min.js"></script>
                    </Helmet>
                </div>
                } */}
            </div>
        </>
    );
}