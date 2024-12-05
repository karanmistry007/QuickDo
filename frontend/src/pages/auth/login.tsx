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

// ? FORM SCHEMAS
const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
})

const Login = () => {
    // ? HOOKS
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(window.innerWidth < 1024)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const navigate = useNavigate()

    // ? FRAPPE LOGIN HOOK
    const { currentUser, isValidating, isLoading, login } = useFrappeAuth()

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
        },
    })

    // ? HANDLE LOGIN
    const handleLogin = (values: z.infer<typeof formSchema>) => {
        // ? CALL LOGIN HOOK
        login({
            username: values.email,
            password: values.password,
        })
            .then((data) => {
                toast.success(`Successfully Logged In As ${data.full_name}`)
            })
            .catch((err) => {
                toast.error(err.message)
            })
    }

    // ? HANDLE SIGN IN WITH GOOGLE
    const handleSignInWithGoogle = () => {
        toast.info('Sign In With Google Is Coming Soon...')
    }

    // ? IF USER EXISTS REDIRECT THEM TO HOME
    currentUser && navigate("/");

    return (
        <>
            {/* LOGIN */}
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">

                {/* LOGIN SECTION */}
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
                                Welcome back to QuickDo,
                                <br />
                                <b>Login</b> to Your task management app.
                            </p>
                        </div>

                        {/* LOGIN FORM */}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">

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

                                {/* PASSWORD */}
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

                                {/* SIGN IN BUTTON */}
                                <Button type="submit" className="w-full bg-black text-white">
                                    Sign In
                                </Button>

                                {/* SIGN IN WITH GOOGLE BUTTON */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleSignInWithGoogle}
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
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Sign In with Google
                                </Button>
                            </form>
                        </Form>

                        {/* LOGIN FOOTER */}
                        <div className="text-center text-sm text-muted-foreground">
                            {/* FORGOT PASSWORD */}
                            <div className="forgot-password sm:mb-2">
                                <p className="hidden sm:inline">
                                    Don't remember password?{" "}
                                </p>
                                <Link
                                    to="/auth/forgot-password"
                                    className="font-medium underline underline-offset-4 hover:text-primary"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            {/* SIGN UP */}
                            <div className="sign-up">
                                <p className="hidden sm:inline">
                                    Don't have an account?{" "}
                                </p>
                                <Link
                                    to="/auth/sign-up"
                                    className="font-medium underline underline-offset-4 hover:text-primary"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

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

export default Login
