'use client'
import { createTheme } from '@mui/material/styles'

// 80s Pastel Color Palette
export const eightiesColors = {
    primary: '#FF6B9D', // Hot Pink
    secondary: '#45E3FF', // Cyan Blue
    accent: '#FFE66D', // Pastel Yellow
    deepPurple: '#2D1B69', // Deep Purple for text
    gradientStart: '#FF9A9E',
    gradientMid: '#FECFEF',
    gradientEnd: '#FECFEF',
    neonPink: '#FF10F0',
    neonCyan: '#00FFFF',
    softWhite: '#FDFCFC'
}

export const eightiesTheme = createTheme({
    palette: {
        primary: {
            main: eightiesColors.primary,
            contrastText: '#FFFFFF'
        },
        secondary: {
            main: eightiesColors.secondary,
            contrastText: eightiesColors.deepPurple
        },
        background: {
            default: eightiesColors.softWhite,
            paper: 'rgba(255, 255, 255, 0.9)'
        },
        text: {
            primary: eightiesColors.deepPurple,
            secondary: '#4A4A4A'
        }
    },
    typography: {
        fontFamily: '"Orbitron", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase'
        },
        h5: {
            fontWeight: 500,
            letterSpacing: '1px'
        },
        h6: {
            fontWeight: 600,
            letterSpacing: '1px',
            textTransform: 'uppercase'
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    padding: '12px 24px',
                    boxShadow: '0 4px 0 rgba(0,0,0,0.2)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 0 rgba(0,0,0,0.2)'
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                        boxShadow: '0 2px 0 rgba(0,0,0,0.2)'
                    }
                },
                contained: {
                    background: `linear-gradient(45deg, ${eightiesColors.primary} 30%, ${eightiesColors.accent} 90%)`,
                    '&:hover': {
                        background: `linear-gradient(45deg, ${eightiesColors.neonPink} 30%, ${eightiesColors.accent} 90%)`
                    },
                    '&:disabled': {
                        background: 'rgba(150,150,150,0.3)',
                        color: 'rgba(0,0,0,0.3)',
                        boxShadow: '0 2px 0 rgba(0,0,0,0.1)'
                    }
                },
                outlined: {
                    borderWidth: '2px',
                    borderColor: eightiesColors.secondary,
                    color: eightiesColors.deepPurple,
                    '&:hover': {
                        borderWidth: '2px',
                        backgroundColor: `${eightiesColors.secondary}20`,
                        borderColor: eightiesColors.neonCyan
                    },
                    '&:disabled': {
                        borderColor: 'rgba(150,150,150,0.3)',
                        color: 'rgba(0,0,0,0.3)',
                        boxShadow: '0 2px 0 rgba(0,0,0,0.1)'
                    }
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    border: `2px solid ${eightiesColors.secondary}`,
                    boxShadow: `0 0 20px ${eightiesColors.secondary}40`,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                }
            }
        },
        MuiInput: {
            styleOverrides: {
                root: {
                    '&:before': {
                        borderBottomColor: eightiesColors.secondary
                    },
                    '&:hover:not(.Mui-disabled):before': {
                        borderBottomColor: eightiesColors.neonCyan
                    },
                    '&.Mui-focused:before': {
                        borderBottomColor: eightiesColors.primary
                    }
                }
            }
        },
        MuiTypography: {
            styleOverrides: {
                h4: {
                    background: `linear-gradient(45deg, ${eightiesColors.primary}, ${eightiesColors.secondary})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': {
                            borderColor: eightiesColors.secondary,
                            borderWidth: '2px'
                        },
                        '&:hover fieldset': {
                            borderColor: eightiesColors.neonCyan
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: eightiesColors.primary,
                            borderWidth: '2px'
                        }
                    },
                    '& .MuiInputLabel-root': {
                        color: eightiesColors.deepPurple,
                        fontWeight: 'bold'
                    }
                }
            }
        }
    }
})
