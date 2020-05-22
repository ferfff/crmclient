import React from 'react'
import Layout from "../components/Layout";
import Customer from "../components/Customer";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";


const GET_CUSTOMERS_BY_USER = gql`
    query getCustomerSeller {
        getCustomerSeller {
            id
            name
            lastName
            email
            company
            phone
        }
    }
`;

const Index = () => {
    const router = useRouter();

    // Get data
    const { data, loading, error} = useQuery(GET_CUSTOMERS_BY_USER);
    
    if(loading) return 'Loading...';

    //When some try to access without login redirect 
    if(!data.getCustomerSeller) {
        return router.push('/login');
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Customers</h1>
            <Link href="/newcustomer">
                <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-blue-200 mb-3 uppercase font-bold">
                    New customer
                </a>
            </Link>

            <table className="table-auto shadow-md mt-10 w-full w-lg">
                <thead className="bg-gray-800">
                    <tr className="text-white">
                        <th className="w-1/5 py-2">Name</th>
                        <th className="w-1/5 py-2">Company</th>
                        <th className="w-1/5 py-2">Email</th>
                        <th className="w-1/5 py-2">Delete</th>
                        <th className="w-1/5 py-2">Edit</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {data.getCustomerSeller.map( customer => (
                        <Customer
                            key={customer.id}
                            customer={customer}
                        />
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}

export default Index;