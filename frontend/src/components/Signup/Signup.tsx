import React, { useState } from 'react';
import { AiOutlineMail, AiOutlineLock, AiOutlineEyeInvisible, AiOutlineUser, AiOutlinePhone, AiOutlineCalendar, AiOutlineClose } from 'react-icons/ai';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function UserRegistrationForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: null,
    password: '',
    confirmPassword: '',
    articlePreferences: [],
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, 'First name cannot contain numbers or special characters')
      .min(2, 'First name must be at least 2 characters long')
      .max(30, 'First name must be at most 30 characters long')
      .required('First name is required'),
    lastName: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, 'Last name cannot contain numbers or special characters')
      .min(2, 'Last name must be at least 2 characters long')
      .max(30, 'Last name must be at most 30 characters long')
      .required('Last name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    dob: Yup.date()
      .max(new Date(), 'Date of birth cannot be in the future')
      .required('Date of birth is required'),
    password: Yup.string()
      .matches(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    articlePreferences: Yup.array()
      .min(1, 'Please select at least one article preference')
      .required('Article preferences are required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    // Handle form submission here
    console.log(values);
    setSubmitting(false);
  };

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const preferences = ['Technology', 'Science', 'Business', 'Entertainment', 'Sports', 'Politics', 'Health', 'Travel'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">User Registration</h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form className="space-y-4">
                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <Field
                          type="text"
                          name="firstName"
                          id="firstName"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="John"
                        />
                        <AiOutlineUser className="absolute top-2.5 right-3 text-gray-400" />
                      </div>
                      <ErrorMessage name="firstName" component="p" className="mt-1 text-sm text-red-600" />
                    </div>
                    <div className="w-1/2">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <Field
                          type="text"
                          name="lastName"
                          id="lastName"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Doe"
                        />
                        <AiOutlineUser className="absolute top-2.5 right-3 text-gray-400" />
                      </div>
                      <ErrorMessage name="lastName" component="p" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="you@example.com"
                      />
                      <AiOutlineMail className="absolute top-2.5 right-3 text-gray-400" />
                    </div>
                    <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-600" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <Field
                        type="tel"
                        name="phone"
                        id="phone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="1234567890"
                      />
                      <AiOutlinePhone className="absolute top-2.5 right-3 text-gray-400" />
                    </div>
                    <ErrorMessage name="phone" component="p" className="mt-1 text-sm text-red-600" />
                  </div>
                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <DatePicker
                        selected={values.dob}
                        onChange={(date) => setFieldValue('dob', date)}
                        dateFormat="MM/dd/yyyy"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholderText="Select date"
                      />
                      <AiOutlineCalendar className="absolute top-2.5 right-3 text-gray-400" />
                    </div>
                    <ErrorMessage name="dob" component="p" className="mt-1 text-sm text-red-600" />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <Field
                        type={isPasswordVisible ? 'text' : 'password'}
                        name="password"
                        id="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="********"
                      />
                      <AiOutlineLock className="absolute top-2.5 right-10 text-gray-400" />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 focus:outline-none"
                      >
                        <AiOutlineEyeInvisible />
                      </button>
                    </div>
                    <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-600" />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <Field
                        type={isPasswordVisible ? 'text' : 'password'}
                        name="confirmPassword"
                        id="confirmPassword"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="********"
                      />
                      <AiOutlineLock className="absolute top-2.5 right-3 text-gray-400" />
                    </div>
                    <ErrorMessage name="confirmPassword" component="p" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  <div>
                    <label htmlFor="articlePreferences" className="block text-sm font-medium text-gray-700">Article Preferences</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <Field
                        as="select"
                        name="articlePreferences"
                        id="articlePreferences"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value && !values.articlePreferences.includes(value)) {
                            setFieldValue('articlePreferences', [...values.articlePreferences, value]);
                          }
                          e.target.value = ''; // Reset dropdown after selection
                        }}
                      >
                        <option value="">Select preferences</option>
                        {preferences.map((pref) => (
                          <option key={pref} value={pref}>
                            {pref}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {values.articlePreferences.map((pref) => (
                        <span
                          key={pref}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {pref}
                          <button
                            type="button"
                            onClick={() => {
                              setFieldValue(
                                'articlePreferences',
                                values.articlePreferences.filter((p) => p !== pref)
                              );
                            }}
                            className="ml-1 inline-flex items-center justify-center w-4 h-4 text-blue-400 hover:bg-blue-200 hover:text-blue-500 rounded-full focus:outline-none"
                          >
                            <AiOutlineClose className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <ErrorMessage name="articlePreferences" component="p" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <div className="md:w-1/2 bg-blue-600">
            <img src="/Little_girl_reading_book.jpg" alt="Register" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}