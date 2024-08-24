import { FieldValues, useForm } from "react-hook-form"
import logo from "../assets/logo.png"
import { signin } from "../services/AuthService";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const LoginIn = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSignIn = async (data: FieldValues) => {
        try {
            const response = await signin({ userName: data.username, password: data.password });
            localStorage.setItem("userType", response.userType);
            console.log('User login successful');
            navigate("/home")
        } catch (error) {
            console.error('Login failed:', (error as AxiosError).response?.data);
        }
    }
    
    console.log(localStorage.getItem('userType'));
    

    return (
        <div className='flex justify-center items-center h-screen bg-gray-300'>
            <div className='sm:w-2/3 w-full h-auto justify-center p-7 shadow-xl rounded-md bg-white'>   
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                            alt="FoE-Room Reservation"
                            src={logo}
                            className="mx-auto h-10 w-auto"
                        />
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={handleSubmit(onSignIn)} className="space-y-6">
                            {/* User Name */}
                            <div>
                                <label htmlFor="username" className="block text-base font-medium leading-6 text-gray-900">
                                    Username
                                </label>
                                <input
                                    {...register('username', {required: true})} id="username" type="text"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                                    placeholder="Enter your username"
                                />
                                {errors.username?.type === 'required' && <p className="text-red-600">Username field is required</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-base font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                                <input
                                    {...register('password', {required: true})} id="password" type="password"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2"
                                    placeholder="Enter your password"
                                />  
                                {errors.password?.type === 'required' && <p className="text-red-600">Password field is required</p>}
                            </div>

                            {/* Sign in Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginIn
