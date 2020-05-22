import React from "react"
import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import { gql, useQuery, useMutation } from "@apollo/client"
import { Formik } from "formik";
import * as Yup from 'yup'
import Swal from 'sweetalert2'

const GET_CUSTOMER = gql`
    query getCustomer($id:ID!) {
        getCustomer(id:$id){
            name
            lastName
            email
            company
            phone
        }
    }
`;

const UPDATE_CUSTOMER = gql`
    mutation updateCustomer($id:ID!, $input: CustomerInput) {
        updateCustomer(id:$id, input:$input){
            name
            lastName
            email
            company
            phone
        }
    }
`;

const UpdateCustomer = () => {
    // get current id
    const router = useRouter();
    const { query: { id } } = router;
    //const id = '5eaae633bfdfce4d100c0fae';
    console.log(id);

    //Get Customer data
    const { data, loading, error } = useQuery(GET_CUSTOMER, {
        variables: {
            id
        }
    });

    // Update Customer data
    const [ updateCustomer ] = useMutation(UPDATE_CUSTOMER)

    // valiation schema
    const schemaValidation = Yup.object({
        name: Yup.string().required('Name required').min(4, '4 characters min'),
        lastName: Yup.string().required('lastName required').min(4, '4 characters min'),
        company: Yup.string().required('Company required').min(4, '4 characters min'),
        email: Yup.string().email('Invalid email').required('E-mail required')
    });

    if(loading) return 'Loading...';

    const {getCustomer} = data;    

    //Update in DB
    const updateInfoCustomer = async values => {
        const {name, lastName, email, company, phone} = values;

        try {
            const { data } = await updateCustomer({
                variables: {
                    id,
                    input: {
                        name,
                        lastName,
                        company,
                        email,
                        phone
                    }
                }
            });
            console.log(data);
            
            //sweet alert
            Swal.fire(
                'Update!',
                'Customer updated correctly',
                'success'
            );
            // Redirect
            router.push("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Edit Customer</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema= {schemaValidation}
                        enableReinitialize
                        initialValues= {getCustomer}
                        onSubmit= { (values) => {
                            console.log(values);
                            updateInfoCustomer(values);
                        }}
                    >

                        {props => {
                            //console.log(props);
                            return(
                                <form
                                    className="bg-white shadow-md px-8 pt-6 mb-4 pb-8"
                                    onSubmit={props.handleSubmit}
                                >

                                    <div className="mb-4">
                                        <label className="block text-red-800 text-sm font-bold mb-2" htmlFor="name">
                                            Name
                                        </label>
                                        <input 
                                            id="name"
                                            type="text"
                                            placeholder="Name"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.name}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-red-800 leading-tight focus:outline-none focus:shadow-outline"
                                        />
                                    </div>
                                    { props.touched.name && props.errors.name ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                            <p className="font-bold">{props.errors.name}</p>
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.lastName}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-red-800 leading-tight focus:outline-none focus:shadow-outline"
                                        />
                                    </div>
                                    { props.touched.lastName && props.errors.lastName ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                            <p className="font-bold">{props.errors.lastName}</p>
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.company}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-red-800 leading-tight focus:outline-none focus:shadow-outline"
                                        />
                                    </div>
                                    { props.touched.company && props.errors.company ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                            <p className="font-bold">{props.errors.company}</p>
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.email}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-red-800 leading-tight focus:outline-none focus:shadow-outline"
                                        />
                                    </div>
                                    { props.touched.email && props.errors.email ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                            <p className="font-bold">{props.errors.email}</p>
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.phone}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-red-800 leading-tight focus:outline-none focus:shadow-outline"
                                        />
                                    </div>

                                    <input 
                                        type="submit"
                                        value="Edit"
                                        className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray:300"
                                    />
                                </form>

                            );
                        }}
                    </Formik>
                </div>
            </div>
        </Layout>
    );
}

export default UpdateCustomer;