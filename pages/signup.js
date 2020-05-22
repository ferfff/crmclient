import React, { useState } from 'react'
import { useRouter } from "next/router"
import Layout from "../components/Layout"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { useMutation, gql } from "@apollo/client"


const NEW_USER = gql`
    mutation newUser($input: UserInput) {
        newUser(input: $input) {
            id
            name
            lastName
            email
        }
}
`;

const SignIn = () => {
    // Message state
    const [ message, saveMessage ] = useState(null);

    // Mutation creating users
    const [ newUser ] = useMutation(NEW_USER);

    // Routing 
    const router = useRouter();

    //Form validation
    const formik = useFormik({
        initialValues: {
            name: '',
            lastname: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('field required').min(4, '4 characters min'),
            lastname: Yup.string().required('field required').min(4, '4 characters min'),
            email: Yup.string().email('Invalid email').required('E-mail required'),
            password: Yup.string().required('Missing password').min(6, '6 characters min')
        }),
        onSubmit: async values => {
            //console.log('sending...');
            console.log(values);
            const { name, lastname, email, password } = values;

            try {
                const { data } = await newUser({
                    variables : {
                        input: {
                            name,
                            lastName: lastname,
                            email,
                            password
                        }
                    }
                });

                // User saved
                saveMessage(`User ${data.newUser.name} saved correctly`);

                setTimeout(() => {
                    saveMessage(null);
                    router.push('/login');
                }, 3000);

                console.log(data);
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

                <h1 className="text-center text-2xl font-light">Sign In</h1>

                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form 
                            className="bg-gray-500 rounded shadow-md px-8 pt-6 pb-8 mb-4"
                            onSubmit={formik.handleSubmit}
                        >
                            <div className="mb-4">
                                <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="name">
                                    Name
                                </label>
                                <input 
                                    id="name"
                                    type="text"
                                    placeholder="Name"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.name && formik.errors.name ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                    <p className="font-bold">{formik.errors.name}</p>
                                </div>
                            ) : null }
                            <div className="mb-4">
                                <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="lastname">
                                    Lastname
                                </label>
                                <input 
                                    id="lastname"
                                    type="text"
                                    placeholder="Last Name"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                                    value={formik.values.lastname}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.lastname && formik.errors.lastname ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                    <p className="font-bold">{formik.errors.lastname}</p>
                                </div>
                            ) : null }
                            <div className="mb-4">
                                <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input 
                                    id="email"
                                    type="email"
                                    placeholder="@"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.email && formik.errors.email ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                    <p className="font-bold">{formik.errors.email}</p>
                                </div>
                            ) : null }
                            <div className="mb-4">
                                <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input 
                                    id="password"
                                    type="password"
                                    placeholder="pwd"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.password && formik.errors.password ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                                    <p className="font-bold">{formik.errors.password}</p>
                                </div>
                            ) : null }
                            <input
                                type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                value="Sign Up"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default SignIn;