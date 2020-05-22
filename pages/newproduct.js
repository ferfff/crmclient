import React, { useState } from 'react'
import Layout from "../components/Layout"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { gql, useMutation } from "@apollo/client"

const NEW_PRODUCT = gql`
    mutation newProduct($input: ProductInput){
        newProduct(input: $input) {
            id
            name
            stock
            price
        }
    }
`;

const NewProduct = () => {
    //Mutation
    const [ newProduct ] = useMutation(NEW_PRODUCT);

    // New products form
    const formik = useFormik({
        initialValues: {
            name: '',
            price: '',
            stock: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Add product name'),
            stock: Yup.number()
                .required('Add stock')
                .positive('Negative number')
                .integer('Only integers'),
            price: Yup.number().required('Add price').positive('Negative number')
        }),
        onSubmit: async (values) => {
            const { name, price, stock } = values;
            console.log(name);
            console.log(price);
            console.log(stock);
            
            try {
                const {data} = await newProduct({
                    variables: {
                        input: {
                            name,
                            stock,
                            price
                        }
                    }
                });

                console.log(data);
                
                
            } catch (error) {
                console.log(error);
                
            }
        }
    });


    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">New Product</h1>

            <div className="flex justify-center mt-5">
                    <div className="w-full max-w-lg">
                        <form
                            className="bg-white shadow-md px-8 pt-6 mb-4 pb-8"
                            onSubmit={formik.handleSubmit}
                        >

                            <div className="mb-4">
                                <label className="block text-red-800 text-sm font-bold mb-2" htmlFor="name">
                                    Name Product
                                </label>
                                <input 
                                    id="name"
                                    type="text"
                                    placeholder="Name"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-red-800 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            { formik.touched.name && formik.errors.name ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                    <p className="font-bold">{formik.errors.name}</p>
                                </div>
                            ) : null }

                            <div className="mb-4">
                                <label className="block text-red-800 text-sm font-bold mb-2" htmlFor="stock">
                                    Stock
                                </label>
                                <input 
                                    id="stock"
                                    type="text"
                                    placeholder="stock"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.stock}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-red-800 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            { formik.touched.stock && formik.errors.stock ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                    <p className="font-bold">{formik.errors.stock}</p>
                                </div>
                            ) : null }

                            <div className="mb-4">
                                <label className="block text-red-800 text-sm font-bold mb-2" htmlFor="price">
                                    Price Product
                                </label>
                                <input 
                                    id="price"
                                    type="text"
                                    placeholder="price"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.price}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-red-800 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            { formik.touched.price && formik.errors.price ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                    <p className="font-bold">{formik.errors.price}</p>
                                </div>
                            ) : null }

                            <input 
                                type="submit"
                                value="Add new product"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray:300"
                            />
                        </form>
                    </div>
                </div>
        </Layout>
    );
}

export default NewProduct;