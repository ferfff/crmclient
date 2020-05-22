import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";

const GET_USER = gql`
    query getUser {
        getUser{
            id 
            name
            lastName
        }
    }
`;

const Header = () => {
    const router = useRouter();

    //get Data
    const { data, loading, error } = useQuery(GET_USER);

    //Access data after loading
    if(loading) return null;

    const {name, lastName} = data.getUser;

    //When some try to access without login redirect 
    if(!data) {
        return router.push('/login');
    }

    
    const closeSession = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <div className="flex justify-between mb-5">
            <p className="mr-2">Hello {name} {lastName}</p>

            <button 
                onClick={() => closeSession()}
                className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md"
                type="button">
                Close Session
            </button>
        </div>
    );
}

export default Header;