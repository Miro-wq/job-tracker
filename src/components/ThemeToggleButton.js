import React, { useContext } from 'react';
import { Button } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import { CustomThemeContext  } from '../components/ThemeContext';

function ThemeToggleButton() {
    const { mode, toggleTheme } = useContext(CustomThemeContext );

    return (
        <Button color="inherit" onClick={toggleTheme}>
            {mode === 'dark' ? <WbSunnyIcon /> : <Brightness2Icon />}
        </Button>
    );
}

export default ThemeToggleButton;