import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import {IconButton, Icon} from "@mui/material"
import { Add } from "@mui/icons-material"

export default function Navbar () {
    return (
        <nav style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
            <img src="/logo.ico" alt="Logo" style={{ height: '60px', marginRight: '10px' }} />
            <h1 style={{ fontSize: '1.5rem', margin: '0' }}>Workspacing</h1>
            <IconButton ><Add/></IconButton>
            <OrganizationSwitcher />
            <UserButton />
        </nav>
    )
}