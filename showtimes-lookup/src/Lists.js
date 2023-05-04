import Header from "./Header";
import { useContext, useEffect } from "react";
import MyContext from "./Context";
import { Heading } from "@chakra-ui/react";
// import requireAuth from './requireAuth';

function Lists () {

    const {currentAccount, setCurrentAccount} = useContext(MyContext);    


    return (
        <>
            <Header />
            <Heading>
                {currentAccount && currentAccount.name + "'s Lists"}
            </Heading>
        </>
    )
}

export default Lists;