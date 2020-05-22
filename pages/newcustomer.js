import React, { useState } from 'react'
import Layout from "../components/Layout"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { gql, useMutation } from "@apollo/client"
import { useRouter } from "next/router"

const NEW_CUSTOMER = gql`
    mutation newCustomer($input: CustomerInput) {
        newCustomer(input: $input) {
            id
            name
            lastName
            company
            email
            phone
        }
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

const NewCustomer = () => {
    // Routing 
    const router = useRouter();

    // Message state
    const [ message, saveMessage ] = useState(null);

    // Create new customer
    const [newCustomer] = useMutation(NEW_CUSTOMER, {
        update(cache, {data: {newCustomer}}) {
            // get cache object to update
            const { getCustomerSeller } = cache.readQuery({ query: GET_CUSTOMERS_BY_USER });

            //rewrite cache
            cache.writeQuery({
                query: GET_CUSTOMERS_BY_USER,
                data: {
                    getCustomerSeller: [...getCustomerSeller, newCustomer]
                }
            });
        }
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            lastName: '',
            company: '',
            email: '',
            phone: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name required').min(4, '4 characters min'),
            lastName: Yup.string().required('lastName required').min(4, '4 characters min'),
            company: Yup.string().required('Company required').min(4, '4 characters min'),
            email: Yup.string().email('Invalid email').required('E-mail required')
        }),
        onSubmit: async values => {
            console.log(values);
            const { name, lastName, company, email, phone } = values;
            try {
                const {data} = await newCustomer({
                    variables: {
                        input: {
                            name,
                            lastName,
                            company,
                            email,
                            phone
                        }
                    }
                });
                //console.log(data.newCustomer);
                router.push('/');
            } catch (error) {
                console.log(error);
                saveMessage(error.message.replace('GraphQL error: ', ''));

                setTimeout(() => {
                    saveMessage(null);
                },2000);
            }
        }
    });

    const showMessage = () => {
        return (
            <div className="bg-red-800 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{message}</p>
            </div>
        )
    };

    return (
        <>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">New Customer</h1>

                {message && showMessage() }

                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-lg">
                        <form
                            className="bg-white shadow-md px-8 pt-6 mb-4 pb-8"
                            onSubmit={formik.handleSubmit}
                        >

                            <div className="mb-4">
                                <label className="block text-red-800 text-sm font-bold mb-2" htmlFor="name">
                                    Name
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
                                <label className="block text-red-800 text-sm font-bold mb-2" htmlFor="lastName">
                                    Lastname
                                </label>
                                <input 
                                    id="lastName"
                                    type="text"
                                    placeholder="lastname"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.lastName}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-red-800 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            { formik.touched.lastName && formik.errors.lastName ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                    <p className="font-bold">{formik.errors.lastName}</p>
                                </div>
                            ) : null }

                            <div className="mb-4">
                                <label className="block text-red-800 text-sm font-bold mb-2" htmlFor="company">
                                    Company
                                </label>
                                <input 
                                    id="company"
                                    type="text"
                                    placeholder="Company"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.company}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-red-800 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            { formik.touched.company && formik.errors.company ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                    <p className="font-bold">{formik.errors.company}</p>
                                </div>
                            ) : null }

                            <div className="mb-4">
                                <label className="block text-red-800 text-sm font-bold mb-2" htmlFor="email">
                                    E-mail
                                </label>
                                <input 
                                    id="email"
                                    type="tel"
                                    placeholder="email"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-red-800 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            { formik.touched.email && formik.errors.email ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                    <p className="font-bold">{formik.errors.email}</p>
                                </div>
                            ) : null }

                            <div className="mb-4">
                                <label className="block text-red-800 text-sm font-bold mb-2" htmlFor="phone">
                                    Phone number
                                </label>
                                <input 
                                    id="phone"
                                    type="text"
                                    placeholder="Phone"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.phone}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-red-800 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>

                            <input 
                                type="submit"
                                value="Register"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray:300"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default NewCustomer;