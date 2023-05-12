import './footer.css';
import {BsGithub, BsEnvelopeAt} from 'react-icons/bs';
import {AiOutlineLinkedin} from 'react-icons/ai';

export default function Footer(){


    return (
        <footer>
            <a href="https://tomasmaldonado.rf.gd" target="_blank" rel="noopener noreferrer">Tomás Maldonado {new Date().getFullYear()}</a>
            <a href='https://github.com/tmaldonado98' target="_blank" rel="noopener noreferrer"><BsGithub/></a>
            <a href='https://www.linkedin.com/in/tom%C3%A1s-maldonado-9b396420a/' target="_blank" rel="noopener noreferrer"><AiOutlineLinkedin/></a>
            <a href="mailto:tmaldonadotrs@gmail.com"><BsEnvelopeAt/></a>
        </footer>
    );
}