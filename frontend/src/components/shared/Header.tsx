import { useState, useRef, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ToDoLogo from '../../assets/Images/ToDoBlack.svg';
import UserProfileImage from '../../assets/Images/UserProfile.png';

// USER PROFILE ITEMS
interface UserProfileItem {
    name: string;
    link: string;
}

const userProfileItems: UserProfileItem[] = [
    { name: "Frappe Dashboard", link: "/app/" },
    { name: "My Profile", link: "/app/user-profile" },
    { name: "My Settings", link: "/app/user" },
    { name: "Logout", link: "/logout" },
];

interface Props {
}
const Header = (props: Props) => {
    // HOOKS
    const [userProfileDropdownActive, setUserProfileDropdownActive] = useState<boolean>(false);
    const userProfileDropdownRef = useRef<HTMLDivElement>(null);

    const handleUserProfileClickOutside = (event: MouseEvent) => {
        if (userProfileDropdownRef.current && !userProfileDropdownRef.current.contains(event.target as Node)) {
            setUserProfileDropdownActive(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleUserProfileClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleUserProfileClickOutside);
        };
    }, []);

    return (
        <>
            {/* NAVBAR */}
            <header className='p-4 sm:px-8 shadow-[0px_0px_25px_-5px_rgba(0,0,0,0.25)] z-[9999999]'>
                <nav className="nav-item-container flex gap-2.5 sm:gap-4 justify-between items-center">
                    {/* LOGO */}
                    <div className='logo nav-item'>
                        <a href="../../todo/my-day/list" className="logo-link">
                            <img src={ToDoLogo} className='w-full max-w-[115px] mix-blend-darken' alt="ToDo Logo" />
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
                        {/* USER PROFILE DROPDOWN */}
                        <div className="user-profile-dropdown cursor-pointer w-10 h-10" title='User Profile' onClick={() => setUserProfileDropdownActive(!userProfileDropdownActive)}>
                            <img className='w-10 h-10 object-cover rounded-full shadow-sm select-none' src={UserProfileImage} alt="User" />
                        </div>
                        {/* END USER PROFILE DROPDOWN */}

                        {/* USER PROFILE ITEMS */}
                        <div className={`user-profile-dropdown-items absolute bg-white p-1 rounded-md right-0 top-10 sm:top-12 flex flex-col justify-center items-start shadow-[0px_0px_25px_-5px_rgba(0,0,0,0.25)] ${userProfileDropdownActive ? "block" : "hidden"}`}>
                            {userProfileItems.map((item, index) => (
                                <div key={index} className="user-profile-item hover:bg-gray-100 rounded-md text-nowrap w-full">
                                    <a href={item.link} className="frappe-ui-link w-full p-1 md:px-2 md:py-1 block">
                                        {item.name}
                                    </a>
                                </div>
                            ))}
                        </div>
                        {/* END USER PROFILE ITEMS */}
                    </div>
                    {/* END USER PROFILE */}

                </nav>
            </header>
            {/* END NAVBAR */}
        </>
    );
};

export default Header;
