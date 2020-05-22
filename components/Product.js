import React from 'react'
import Swal from 'sweetalert2'
import {gql, useMutation, useQuery} from "@apollo/client"
import Router from 'next/router'

const DELETE_PRODUCT = gql`
    mutation deleteProduct($id: ID!) {
        deleteProduct(id: $id)
    }
`;

const GET_PRODUCTS = gql`
    query getProducts {
        getProducts{
            id
            name
            stock
            price
            created
        }
    }
`;

const Product = ({product}) => {

    const { id, name, price, stock } = product;

    //Deleting product
    const [ deleteProduct ] = useMutation(DELETE_PRODUCT, {
        update(cache) {
            // Get copy of cache
            const { getProducts } = cache.readQuery({ query: GET_PRODUCTS });

            // rewrite cache
            cache.writeQuery({
                query: GET_PRODUCTS,
                data: {
                    getProducts : getProducts.filter( currentProduct => currentProduct.id !== id)
                }
            });
        }
    });


    //Delete customer
    const confirmDeleteProduct = () => {
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
                    const { data } = await deleteProduct({
                        variables: {
                            id
                        }
                    });

                    //Show alert
                    Swal.fire(
                        'Deleted!',
                        data.deleteProduct,
                        'success'
                      )
                } catch (error) {
                    console.log(error);
                    
                }
            }
        })
    }

    return (
        <tr>
            <td className="border px-4 py-2">{name}</td>
            <td className="border px-4 py-2">{stock}</td>
            <td className="border px-4 py-2">$ {price}</td>
            <td>
                <button
                    type="button"
                    className="flex justify-center items-center bg-red-700 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    onClick={ () => confirmDeleteProduct() }
                >
                    Delete
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5 ml-2"><path d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"></path></svg>
                </button>
            </td>
            <td>
                <button
                    type="button"
                    className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    //onClick={ () => editCustomer() }
                >
                    Edit
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5 ml-2"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
            </td>
        </tr>
    );
}

export default Product;