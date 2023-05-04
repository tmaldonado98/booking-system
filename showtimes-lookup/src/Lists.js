import Header from "./Header";
import { useContext, useEffect } from "react";
import MyContext from "./Context";
import { Heading } from "@chakra-ui/react";
import { Button } from "reactstrap";
import { Link, useLocation, useNavigate} from 'react-router-dom';

function Lists () {

    const {currentAccount, setCurrentAccount} = useContext(MyContext);    


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
                Head to the home page to browse without signing in
            </h4>
            <h4>
                Sign in to create your own custom lists!
            </h4>
            <Link to='/'>
                <Button>Home</Button>
            </Link>

        </>
        }
        </section>
    )
}

export default Lists;