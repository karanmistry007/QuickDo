import { useRef } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ToDoLogo from '../../assets/Images/Logo.png';
import UserProfileImage from '../../assets/Images/UserProfile.jpeg';
import { UserProfileItem } from '../../types/Common';
import Cookies from 'js-cookie';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


//? USER PROFILE DROPDOWN
const userProfileItems: UserProfileItem[] = [
    { name: "Frappe Dashboard", link: "/app/quickdos" },
    { name: "Apps", link: "/apps/" },
    { name: "My Profile", link: "/app/user-profile" },
    { name: "My Settings", link: "/app/user" },
    { name: "Logout", link: "/quickdo/auth/logout" },
];


const Navbar = () => {


    //? HOOKS
    const userProfileDropdownRef = useRef<HTMLDivElement>(null);
    const userImage = Cookies.get('user_image');
    const currentUser = Cookies.get('full_name');


    return (
        <>
            {/* NAVBAR */}
            <header className='p-4 fixed top-0 left-0 sm:static bg-white sm:px-4 sm:py-2.5 shadow-[0px_0px_25px_-5px_rgba(0,0,0,0.25)] z-[999]'>
                <nav className="nav-item-container flex gap-2.5 sm:gap-4 justify-between items-center">

                    {/* LOGO */}
                    <div className='logo nav-item'>
                        <a href="../../quickdo" className="logo-link">
                            <img src={ToDoLogo} className='w-full max-w-[140px] mix-blend-darken' alt="ToDo Logo" />
                        </a>
                    </div>
                    {/* END LOGO */}

                    {/* NAVBAR ITEMS */}
                    <div className='inner-item-group nav-item flex items-center gap-4 ml-auto'>

                        {/* SEARCH  */}
                        <div className="search inner-item rounded-md px-1 flex items-center justify-center w-full md:w-auto bg-gray-100" title='Search...'>
                            <SearchIcon className='' />
                            <input className='p-1 outline-0 rounded-md w-full max-w-[300px] md:min-w-[300px] md:max-w-[500px] bg-transparent placeholder:text-sm placeholder:select-none sm:text-base' placeholder='Search...' type="search" id='search' name='search' />
                        </div>
                        {/* END SEARCH  */}

                    </div>
                    {/* END NAVBAR ITEMS */}

                    {/* USER PROFILE */}
                    <div className='user-profile nav-item relative' ref={userProfileDropdownRef}>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <img className='w-10 h-10 object-cover border border-[#e2e2e2] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-full select-none' src={userImage ? userImage : UserProfileImage} alt="User" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='mr-[10px] z-[9999999]'>
                                <DropdownMenuLabel>{currentUser}</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {userProfileItems.map((item, index) => (
                                    <DropdownMenuItem key={index} className='p-0'>
                                        <a href={item.link} className="frappe-ui-link w-full p-1 md:px-2 md:py-1 block">
                                            {item.name}
                                        </a>
                                    </DropdownMenuItem>
                                ))}

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {/* END USER PROFILE */}

                </nav>
            </header>
            {/* END NAVBAR */}
        </>
    );
};

export default Navbar;
