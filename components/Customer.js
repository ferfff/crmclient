import React from 'react'
import Swal from 'sweetalert2'
import {gql, useMutation} from "@apollo/client"
import Router from 'next/router'

const DELETE_CUSTOMER = gql`
    mutation deleteCustomer($id: ID!) {
        deleteCustomer(id: $id)
    }
`;

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

const Customer = ({customer}) => {
    //Delete customer
    const [deleteCustomer] = useMutation(DELETE_CUSTOMER, {
        update(cache) {
            // Get copy of cache
            const { getCustomerSeller } = cache.readQuery({ query: GET_CUSTOMERS_BY_USER });

            // rewrite cache
            cache.writeQuery({
                query: GET_CUSTOMERS_BY_USER,
                data: {
                    getCustomerSeller : getCustomerSeller.filter( currentCustomer => currentCustomer.id !== id)
                }
            });
        }
    }); 

    const { id, name, lastName, company, phone } = customer;
    

    //Delete customer
    const confirmDeleteCustomer = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then( async (result) => {
            if (result.value) {
                
                try {
                    //Delete by id
                    const { data } = await deleteCustomer({
                        variables: {
                            id
                        }
                    });

                    //Show alert
                    Swal.fire(
                        'Deleted!',
                        data.deleteCustomer,
                        'success'
                      )
                } catch (error) {
                    console.log(error);
                    
                }
            }
        })
    }

    //Edit customer
    const editCustomer = () => {
        Router.push({
            pathname: "/editcustomer/[id]",
            query: { id }
        })
    };

    return (
        <tr>
            <td className="border px-4 py-2">{name} {lastName}</td>
            <td className="border px-4 py-2">{company}</td>
            <td className="border px-4 py-2">{phone}</td>
            <td>
                <button
                    type="button"
                    className="flex justify-center items-center bg-red-700 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    onClick={ () => confirmDeleteCustomer() }
                >
                    Delete
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5 ml-2"><path d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"></path></svg>
                </button>
            </td>
            <td>
                <button
                    type="button"
                    className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    onClick={ () => editCustomer() }
                >
                    Edit
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5 ml-2"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
            </td>
        </tr>
    );
}

export default Customer;