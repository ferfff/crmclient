import React, { useState } from 'react'
import { useRouter } from "next/router"
import Layout from "../components/Layout"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { gql, useMutation } from "@apollo/client";

const AUTHENTICATE_USER = gql`
    mutation authenticateUser($input: AuthenticateInput){
        authenticateUser(input: $input){
            token
        }
    }
`;

const Login = () => {
     // Message state
     const [ message, saveMessage ] = useState(null);

    //Mutation to create users
    const [ authenticateUser ] = useMutation(AUTHENTICATE_USER);

    // Routing 
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('E-mail not valid').required('Required field'),
            password: Yup.string().required('Password required')
        }),
        onSubmit: async values => {
            console.log(values);
            const { email, password } = values;

            try {
                const { data } = await authenticateUser({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                });
                console.log(data);
                saveMessage('Verifying...');

                //Save token in local storage
                const { token } = data.authenticateUser;
                localStorage.setItem('token', token);

                // Redirect to customers
                setTimeout(() => {
                    saveMessage(null);
                    router.push('/');
                },2000);
            } catch (error) {
                saveMessage(error.message.replace('GraphQL error: ', ''));

                setTimeout(() => {
                    saveMessage(null);
                }, 3000);
                console.log(error);
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
                {message && showMessage() }
                
                <h1 className="text-center text-2xl font-light">Login</h1>

                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form 
                            onSubmit={formik.handleSubmit}
                            className="bg-gray-500 rounded shadow-md px-8 pt-6 pb-8 mb-4">
                            <div className="mb-4">
                                <label className="block text-red-800 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input 
                                    id="email"
                                    type="email"
                                    placeholder="@"
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
                                <label className="block text-red-800 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input 
                                    id="password"
                                    type="password"
                                    placeholder="pwd"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-red-800 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            { formik.touched.password && formik.errors.password ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                    <p className="font-bold">{formik.errors.password}</p>
                                </div>
                            ) : null }

                            <input
                                type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                value="Log In"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default Login;