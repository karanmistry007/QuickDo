'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import LoginBackground from "@/assets/images/login_page_bg.jpg"
import QuickDoLogo from "@/assets/images/logo.png"
import { useEffect, useState } from "react"
import { useFrappeAuth } from "frappe-react-sdk"
import { toast } from 'sonner'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { signUp } from "@/utils/sign-up"


// ? REGULAR EXPRESSION FOR PASSWORD
const passwordStrengthSchema = z.string().min(8, {
    message: "Password must be at least 8 characters long.",
}).regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
}).regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter.",
}).regex(/[0-9]/, {
    message: "Password must contain at least one number.",
}).regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character.",
});

// ? FORM SCHEMAS
const formSchema = z.object({
    fullName: z.string().min(2, {
        message: "Full name must be at least 2 characters",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

const SignUp = () => {
    // ? HOOKS
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(window.innerWidth < 1024)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const navigate = useNavigate()

    // ? FRAPPE LOGIN HOOK
    const { currentUser, isValidating, isLoading, login } = useFrappeAuth();

    // ? UPDATE THE VARIABLE OF SCREEN SIZE BELOW 1024PX
    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 1024)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // ? INIT FORM
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    // ? HANDLE SIGN UP
    const handleSignUp = (values: z.infer<typeof formSchema>) => {

        signUp(values.fullName, values.email, values.password).then((data) => {

            // ? IF SUCCESSFULLY LOGIN
            if (data.success) {
                toast.success(data.message);

                // ? HANDLE LOGIN
                login({
                    username: values.email,
                    password: values.password,
                })
                    .then((data) => {
                        toast.success(`Successfully Logged In As ${data.full_name}`);
                    })
                    .catch((err) => {
                        toast.error(err.message);
                    })
            }

            // ? IF SOME ERROR
            else {
                toast.error(data.message);
            }
            console.log("data", data)
        })
            .catch((err) => {
                toast.error(err.message)
            })

    }

    // ? HANDLE SIGN UP WITH GOOGLE
    const handleSignUpWithGoogle = () => {
        toast.info('Sign Up With Google Is Coming Soon...')
    }

    // ? IF USER EXISTS REDIRECT THEM TO HOME
    currentUser && navigate("/");

    return (
        <>
            {/* SIGN UP */}
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">

                {/* IMAGE SECTION */}
                <div className="hidden lg:block">
                    {/* IMAGE */}
                    <div className="relative h-screen w-full overflow-hidden">
                        <img
                            src={LoginBackground}
                            alt="Login cover"
                            className="object-cover w-full h-full"
                        />

                        {/* CAPTION */}
                        <div className="absolute bottom-0 left-0 p-8 space-y-2 text-black w-full">
                            <h2 className="text-4xl font-medium">QuickDo</h2>
                            <p className="max-w-md text-sm opacity-80">
                                Introducing our to-do management app, built with React and the Frappe framework. Simplify your task creation and management with an intuitive interface that allows you to categorize and organize your to-dos efficiently. Boost your productivity and stay on top of your tasks with ease.
                            </p>
                        </div>
                    </div>
                </div>

                {/* SIGN UP SECTION */}
                <div className="flex items-center justify-center px-8 py-12 lg:px-12 bg-fixed bg-no-repeat bg-top bg-cover"
                    style={{
                        backgroundImage: isSmallScreen ? `url(${LoginBackground})` : 'none',
                    }}>
                    <div className="mx-auto w-full max-w-sm space-y-6 bg-[#ffffffa3] rounded-lg backdrop-blur-sm lg:backdrop-blur-none p-8 lg:p-0">

                        {/* LOGIN HEADING */}
                        <div className="space-y-2">
                            <img
                                src={QuickDoLogo}
                                alt=""
                                className="m-auto max-h-[80px] p-4 bg-blend-screen"
                            />
                            <p className="text-sm text-muted-foreground text-center">
                                Welcome to QuickDo,
                                <br />
                                <b>Sign Up</b> to start managing your tasks.
                            </p>
                        </div>

                        {/* SIGN UP FORM */}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">

                                {/* FULL NAME */}
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="placeholder:text-black lg:placeholder:text-inherit border-black lg:border-inherit"
                                                    placeholder="Enter your full name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* EMAIL */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="placeholder:text-black lg:placeholder:text-inherit border-black lg:border-inherit"
                                                    placeholder="Enter your email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* PASSWORD 1 */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center justify-between">
                                                <FormLabel>Password</FormLabel>
                                            </div>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        className="placeholder:text-black lg:placeholder:text-inherit border-black lg:border-inherit"
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        {...field}
                                                    />
                                                    {/* Eye Icon */}
                                                    <span
                                                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                                                        onClick={() => setShowPassword((prev) => !prev)}
                                                    >
                                                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                                    </span>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* PASSWORD 2 */}
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center justify-between">
                                                <FormLabel>Confirm Password</FormLabel>
                                            </div>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        className="placeholder:text-black lg:placeholder:text-inherit border-black lg:border-inherit"
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        {...field}
                                                    />
                                                    {/* Eye Icon */}
                                                    <span
                                                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                                                        onClick={() => setShowPassword((prev) => !prev)}
                                                    >
                                                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                                    </span>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* SIGN UP BUTTON */}
                                <Button type="submit" className="w-full bg-black text-white">
                                    Sign Up
                                </Button>

                                {/* SIGN UP WITH GOOGLE BUTTON */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleSignUpWithGoogle}
                                >
                                    <svg
                                        className="mr-2 h-4 w-4"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.65-2.21 1.04-3.71 1.04-2.86 0-5.29-1.94-6.16-4.56H1.68v2.85C3.47 19.08 7.41 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.61c-.29-.82-.46-1.7-.46-2.61s.17-1.79.46-2.61V6.92H1.68C.63 8.29 0 10.03 0 12s.63 3.71 1.68 4.92h4.16c.87-2.62 3.3-4.56 6.16-4.56z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 4.74c1.48 0 2.73.51 3.71 1.36l2.76-2.13C16.46 2.3 14.23.96 12 0 7.41 0 3.47 4.92 1.68 8.29l4.16 3.12c.87-2.61 3.29-4.56 6.16-4.56z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Sign Up with Google
                                </Button>

                                <p className="text-sm text-muted-foreground text-center mt-4">
                                    Already have an account?{" "}
                                    <Link to="/auth/login" className="font-medium text-primary">
                                        Sign In
                                    </Link>
                                </p>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>

            {/* LOADING ANIMATION */}
            {(isLoading || isValidating) && (
                <div className="loader-container absolute w-[100dvw] h-[100dvh] left-0 top-0 flex justify-center items-center">
                    <div className="loader"></div>
                </div>
            )}
        </>
    )
}

export default SignUp
