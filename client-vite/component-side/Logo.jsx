import { IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

export default function Logo() {

    const hamburger = () => console.log('change breadcrumbs width')

    const col1 = '#a4508b'
    const col2 = '#5f0a87'
    return (
        <div style={{
            position: 'absolute',
            width: 216,
            height: 48,
            backgroundImage: `linear-gradient(330deg, ${col1} 0%, ${col2} 74%)`,
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
            color: '#fff',
            display: 'flex',
            justifyContent: 'center'}}>
            <Toolbar variant={"dense"}>
                <IconButton
                    sx={{ mr: 2 }}
                    edge="start"
                    aria-label="menu"
                    onClick={hamburger}
                    color="inherit">
                    <MenuIcon/>
                </IconButton>

                <Typography variant="h6">
                    {'mapboard'}
                </Typography>
            </Toolbar>
        </div>
    )
}
