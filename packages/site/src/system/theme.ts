export const theme = {
  breakpoints: {
    small: '@media screen and (min-width: 600px)',
    medium: '@media screen and (min-width: 960px)',
    large: '@media screen and (min-width: 1200px)',
  },
  colors: {
    brand: '#8D6CEE',
    brandTint: '#7B5AD9',
    brandShade: '#342054',
    foreground: 'white',
    foregroundSecondary: 'rgba(255, 255, 255, 0.8)',
    surface: '#f3efff',
    surfaceDark: '#282a36',
    shadow: '#3d157d',
  },
  fontSizes: {
    small: {
      default: 32,
      'breakpoints.medium': 12,
    },
    medium: {
      default: 48,
      'breakpoints.medium': 16,
    },
    large: {
      default: 72,
      'breakpoints.medium': 28,
    },
    xlarge: {
      default: 60,
      'breakpoints.medium': 96,
    },
    xxlarge: {
      default: 128,
      'breakpoints.medium': 112,
    },
  },
  fontWeights: {
    medium: 400,
    bold: 700,
    black: 900,
  },
  lineLengths: {
    narrow: '14ch',
    wide: 'min(40ch, 60ch)',
  },
  letterSpacings: {
    normal: 0.25,
    tracked: {
      default: 0.3,
      'mode.dark': 0.4,
    },
  },
  boxSpacings: {
    xxsmall: '4px',
    xsmall: '8px',
    small: '16px',
    medium: '24px',
    large: '40px',
    xlarge: '60px',
    xxlarge: '80px',
  },
  boxSizes: {
    xxsmall: '4px',
    xsmall: '8px',
    small: '16px',
    medium: '24px',
    large: '40px',
    xlarge: '60px',
    xxlarge: '80px',
    container: {
      small: '640px',
      medium: '960px',
      large: '1440px',
    },
    button: {},
    input: {},
    icon: {
      small: '20px',
      medium: '32px',
    },
  },
} as const

export type Theme = typeof theme

const baseTheme = {
  colors: {
    brand: '#8D6CEE',
    brandTint: '#7B5AD9',
    brandShade: '#342054',
    // foreground: {
    //   default: 'white',
    //   dark: '#1D1D1D',
    // },
    foreground: 'white',
    foregroundSecondary: 'rgba(255, 255, 255, 0.8)',
    surface: '#f3efff',
    surfaceDark: '#282a36',
    shadow: '#3d157d',
  },
  fontSizes: {
    small: {
      default: 32,
      'breakpoints.medium': 12,
      'mode.presentation.default': 32,
    },
    medium: {
      default: 48,
      'breakpoints.medium': 16,
    },
    large: {
      default: 72,
      'breakpoints.medium': 28,
    },
    xlarge: {
      default: 128,
      'breakpoints.medium': 96,
    },
  },
  fontWeights: {
    medium: 400,
    bold: 700,
    black: 900,
    // bold: {
    //   default: 500,
    //   'mode.dark': 600,
    // },
  },
}

const presentationTheme = {
  fontSizes: {
    small: {
      default: 32,
      'breakpoints.medium': 12,
      'mode.presentation.default': 32,
    },
    medium: {
      default: 48,
      'breakpoints.medium': 16,
    },
    large: {
      default: 72,
      'breakpoints.medium': 28,
    },
    xlarge: {
      default: 128,
      'breakpoints.medium': 96,
    },
  },
}
